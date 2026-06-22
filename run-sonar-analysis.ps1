# SonarQube Analysis Helper Script for Windows (PowerShell)
# This script helps set up and run SonarQube analysis

param(
    [Switch]$SkipTests,
    [Switch]$SkipInstall
)

# Colors for output
function Write-Success {
    Write-Host "✓ $args" -ForegroundColor Green
}

function Write-Warning {
    Write-Host "⚠ $args" -ForegroundColor Yellow
}

function Write-Error {
    Write-Host "✗ $args" -ForegroundColor Red
}

function Write-Header {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "$args" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
}

# Main script
function Main {
    Write-Header "SonarQube Analysis Setup and Execution"

    # Check if .env exists
    if (-Not (Test-Path .env)) {
        Write-Warning ".env file not found. Creating from .env.example..."
        if (-Not (Test-Path .env.example)) {
            Write-Error ".env.example file not found!"
            exit 1
        }
        Copy-Item .env.example .env
        Write-Success ".env file created. Please edit it with your SonarQube credentials."
        Write-Host "Once you've configured .env, run this script again."
        exit 0
    }

    # Load environment variables from .env
    Get-Content .env | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]*)\s*=\s*(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim()
            [Environment]::SetEnvironmentVariable($key, $value, "Process")
        }
    }

    # Step 1: Check and install dependencies
    if (-Not $SkipInstall) {
        Write-Header "Step 1: Installing Dependencies"

        # Check if npm is installed
        if (-Not (Get-Command npm -ErrorAction SilentlyContinue)) {
            Write-Error "npm is not installed. Please install Node.js and npm."
            exit 1
        }
        Write-Success "npm found"

        # Install root dependencies
        Write-Warning "Installing root dependencies..."
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install root dependencies"
            exit 1
        }

        # Install frontend dependencies
        Write-Warning "Installing frontend dependencies..."
        Push-Location front
        npm install
        Pop-Location
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install frontend dependencies"
            exit 1
        }
        Write-Success "Frontend dependencies installed"

        # Install backend dependencies
        Write-Warning "Installing backend dependencies..."
        Push-Location back
        npm install
        Pop-Location
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install backend dependencies"
            exit 1
        }
        Write-Success "Backend dependencies installed"
    }

    # Step 2: Check Sonar Scanner
    Write-Header "Step 2: Checking Sonar Scanner"
    if (-Not (Get-Command sonar-scanner -ErrorAction SilentlyContinue)) {
        Write-Warning "sonar-scanner not found globally. Installing..."
        npm install -g sonarqube-scanner
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Failed to install sonar-scanner"
            exit 1
        }
        Write-Success "sonar-scanner installed globally"
    }
    else {
        Write-Success "sonar-scanner already installed"
    }

    # Step 3: Run tests and generate coverage
    if (-Not $SkipTests) {
        Write-Header "Step 3: Running Tests and Generating Coverage Reports"

        Write-Warning "Running frontend tests with coverage..."
        Push-Location front
        npm run test:coverage
        Pop-Location
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Frontend tests failed"
            exit 1
        }
        Write-Success "Frontend coverage generated"

        Write-Warning "Running backend tests with coverage..."
        Push-Location back
        npm run test:coverage
        Pop-Location
        if ($LASTEXITCODE -ne 0) {
            Write-Error "Backend tests failed"
            exit 1
        }
        Write-Success "Backend coverage generated"
    }

    # Step 4: Run SonarQube analysis
    Write-Header "Step 4: Running SonarQube Analysis"

    $sonarLogin = [Environment]::GetEnvironmentVariable("SONAR_LOGIN", "Process")
    if ([string]::IsNullOrEmpty($sonarLogin)) {
        Write-Error "SONAR_LOGIN not set in .env file. Please configure it."
        exit 1
    }

    $sonarHostUrl = [Environment]::GetEnvironmentVariable("SONAR_HOST_URL", "Process")
    if ([string]::IsNullOrEmpty($sonarHostUrl)) {
        $sonarHostUrl = "https://sonarcloud.io"
    }

    $sonarOrg = [Environment]::GetEnvironmentVariable("SONAR_ORGANIZATION", "Process")
    if ([string]::IsNullOrEmpty($sonarOrg)) {
        $sonarOrg = "robel-manoa"
    }

    Write-Warning "Executing SonarQube analysis..."

    $sonarArgs = @(
        "-Dsonar.host.url=$sonarHostUrl",
        "-Dsonar.login=$sonarLogin",
        "-Dsonar.projectKey=Robel-Manoa_my-app",
        "-Dsonar.organization=$sonarOrg"
    )

    & sonar-scanner @sonarArgs

    if ($LASTEXITCODE -ne 0) {
        Write-Error "SonarQube analysis failed"
        exit 1
    }

    Write-Success "SonarQube analysis completed!"

    Write-Header "Analysis Complete!"
    Write-Host ""
    Write-Host "Results available at:"
    Write-Host "  $sonarHostUrl/dashboard?id=Robel-Manoa_my-app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Metrics to review:"
    Write-Host "  - Quality Gate Status"
    Write-Host "  - Code Coverage"
    Write-Host "  - Duplications"
    Write-Host "  - Security Issues"
    Write-Host "  - Maintainability Rating"
    Write-Host "  - Open Issues"
    Write-Host ""
}

# Execute main function
Main
