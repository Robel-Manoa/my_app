#!/bin/bash

# SonarQube Analysis Helper Script for Full-Stack Application
# This script helps set up and run SonarQube analysis

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

# Main script
main() {
    print_header "SonarQube Analysis Setup and Execution"

    # Check if .env exists
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        if [ ! -f .env.example ]; then
            print_error ".env.example file not found!"
            exit 1
        fi
        cp .env.example .env
        print_success ".env file created. Please edit it with your SonarQube credentials."
        echo "Once you've configured .env, run this script again."
        exit 0
    fi

    # Load environment variables
    set -a
    source .env
    set +a

    print_header "Step 1: Installing Dependencies"

    # Check if npm is installed
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install Node.js and npm."
        exit 1
    fi
    print_success "npm found"

    # Install root dependencies
    print_warning "Installing root dependencies..."
    npm install

    # Install frontend dependencies
    print_warning "Installing frontend dependencies..."
    cd front
    npm install
    cd ..
    print_success "Frontend dependencies installed"

    # Install backend dependencies
    print_warning "Installing backend dependencies..."
    cd back
    npm install
    cd ..
    print_success "Backend dependencies installed"

    # Check if sonar-scanner is installed globally
    print_header "Step 2: Checking Sonar Scanner"
    if ! command -v sonar-scanner &> /dev/null; then
        print_warning "sonar-scanner not found globally. Installing..."
        npm install -g sonarqube-scanner
        print_success "sonar-scanner installed globally"
    else
        print_success "sonar-scanner already installed"
    fi

    # Run tests and generate coverage
    print_header "Step 3: Running Tests and Generating Coverage Reports"

    print_warning "Running frontend tests with coverage..."
    cd front
    npm run test:coverage
    cd ..
    print_success "Frontend coverage generated"

    print_warning "Running backend tests with coverage..."
    cd back
    npm run test:coverage
    cd ..
    print_success "Backend coverage generated"

    # Run SonarQube analysis
    print_header "Step 4: Running SonarQube Analysis"

    if [ -z "$SONAR_LOGIN" ]; then
        print_error "SONAR_LOGIN not set in .env file. Please configure it."
        exit 1
    fi

    print_warning "Executing SonarQube analysis..."
    
    sonar-scanner \
        -Dsonar.host.url="${SONAR_HOST_URL:-https://sonarcloud.io}" \
        -Dsonar.login="${SONAR_LOGIN}" \
        -Dsonar.projectKey="Robel-Manoa_my-app" \
        -Dsonar.organization="${SONAR_ORGANIZATION:-robel-manoa}"

    print_success "SonarQube analysis completed!"

    print_header "Analysis Complete!"
    echo ""
    echo "Results available at:"
    echo "  ${SONAR_HOST_URL:-https://sonarcloud.io}/dashboard?id=Robel-Manoa_my-app"
    echo ""
    echo "Metrics to review:"
    echo "  - Quality Gate Status"
    echo "  - Code Coverage"
    echo "  - Duplications"
    echo "  - Security Issues"
    echo "  - Maintainability Rating"
    echo "  - Open Issues"
    echo ""
}

# Run main function
main "$@"
