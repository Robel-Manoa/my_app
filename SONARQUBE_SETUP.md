# SonarQube/SonarCloud Integration Guide

## Overview
This project is configured to generate comprehensive SonarQube analysis including:
- **Quality Gate Status**
- **Open Issues**
- **Duplications**
- **Coverage**
- **Security Rating**
- **Security Issues**
- **Open Security Issues by Severity**
- **Maintainability Issues**
- **Maintainability Rating**
- **Maintainability issues over time**

## Prerequisites

### Option 1: Using SonarCloud (Cloud-based - Recommended)
1. Create an account on [SonarCloud](https://sonarcloud.io)
2. Create an organization
3. Get your authentication token from your account settings

### Option 2: Using SonarQube Server (Self-hosted)
1. Install SonarQube locally or on a server
2. Ensure it's running on `http://localhost:9000` (or configure the URL)
3. Create a project and get the authentication token

## Installation

### 1. Install Sonar Scanner
```bash
npm install -g sonarqube-scanner
# or
npm install --save-dev sonarqube-scanner
```

### 2. Install Coverage Reporters
#### Frontend (React)
```bash
cd front
npm install --save-dev @testing-library/react jest-coverage-report
```

#### Backend (Node.js/TypeScript)
```bash
cd back
npm install --save-dev jest @types/jest ts-jest
```

## Configuration

### 1. Create `.env` file (do not commit)
Create a `.env` file in the root directory:
```bash
SONAR_HOST_URL=https://sonarcloud.io  # For SonarCloud
# OR
SONAR_HOST_URL=http://localhost:9000  # For local SonarQube

SONAR_LOGIN=your_token_here
SONAR_PASSWORD=  # Leave empty for SonarCloud
```

### 2. Frontend Configuration
The `front/` directory automatically uses the coverage reports in LCOV format. Ensure `jest.config.js` exists:

```javascript
// front/jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/index.js',
    '!src/reportWebVitals.js'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: ['/node_modules/'],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js']
};
```

### 3. Backend Configuration
Ensure `back/jest.config.js` exists:

```javascript
// back/jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src', '<rootDir>/test'],
  testMatch: ['**/__tests__/**/*.ts', '**/?(*.)+(spec|test).ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/index.ts'
  ],
  coverageReporters: ['text', 'lcov', 'html'],
  coveragePathIgnorePatterns: ['/node_modules/']
};
```

## Running Analysis

### Option A: Using npm scripts (Recommended)

#### Frontend Analysis
```bash
cd front
npm run test:coverage          # Generate coverage
npm run sonar                  # Run SonarQube analysis
```

#### Backend Analysis
```bash
cd back
npm run test:coverage          # Generate coverage
npm run sonar                  # Run SonarQube analysis
```

#### Full Project Analysis (from root)
```bash
# Set environment variables first
export SONAR_LOGIN=your_token_here
# or
set SONAR_LOGIN=your_token_here  # Windows

npm run analyze:sonar          # Runs analysis on both front and back
```

### Option B: Manual Sonar Scanner Execution

```bash
# From root directory
sonar-scanner \
  -Dsonar.projectKey=Robel-Manoa_my-app \
  -Dsonar.sources=front/src,back/src \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=your_token_here
```

## Generated Reports

After running the analysis, you can access reports at:

- **SonarCloud Dashboard**: https://sonarcloud.io/dashboard?id=Robel-Manoa_my-app
- **Local SonarQube Dashboard**: http://localhost:9000/dashboard?id=Robel-Manoa_my-app

## Key Metrics Tracked

| Metric | Description |
|--------|-------------|
| **Quality Gate Status** | Pass/Fail based on configured thresholds |
| **Open Issues** | All unresolved bugs, vulnerabilities, and code smells |
| **Duplications** | Percentage of duplicated code lines |
| **Coverage** | Code lines covered by tests (%) |
| **Security Rating** | A-F rating based on security issues |
| **Security Issues** | Number of vulnerabilities found |
| **Maintainability Rating** | A-F rating based on code maintainability |
| **Maintainability Issues** | Code smells and technical debt items |

## Troubleshooting

### Issue: "Not authorized. Please check the properties sonar.login and sonar.password"
**Solution**: 
- Verify your `SONAR_LOGIN` token is correct
- Check that you're using the right URL (SonarCloud vs local)

### Issue: "Coverage report not found"
**Solution**:
- Run `npm run test:coverage` first to generate coverage files
- Verify `lcov.info` files exist in `front/coverage/` and `back/coverage/`

### Issue: Tests are failing
**Solution**:
- Run tests locally first: `npm test`
- Fix any test failures before running SonarQube analysis

## CI/CD Integration

### GitHub Actions Example
```yaml
name: SonarQube Analysis

on:
  push:
    branches: [ main, dev ]
  pull_request:
    branches: [ main ]

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd front && npm install
          cd ../back && npm install
      
      - name: Run tests with coverage
        run: |
          cd front && npm run test:coverage
          cd ../back && npm run test:coverage
      
      - name: Run SonarQube analysis
        uses: SonarSource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

## Additional Resources

- [SonarQube Documentation](https://docs.sonarqube.org/)
- [SonarCloud Documentation](https://docs.sonarcloud.io/)
- [SonarSource Scanner for JavaScript/TypeScript](https://docs.sonarqube.org/latest/analysis/languages/javascript/)
- [Jest Coverage Configuration](https://jestjs.io/docs/coverage)

## Next Steps

1. Set up your SonarCloud/SonarQube account
2. Create a project token
3. Add environment variables to your system/CI
4. Run the first analysis: `npm run sonar`
5. Access your dashboard and configure Quality Gates
6. Set up automated analysis in your CI/CD pipeline
