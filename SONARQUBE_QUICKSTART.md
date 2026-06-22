# Quick Start Guide for SonarQube Integration

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- npm 9+ installed
- SonarCloud account (or local SonarQube server)

### Step 1: Create SonarCloud Account (if needed)
1. Go to [SonarCloud.io](https://sonarcloud.io)
2. Click "Sign up"
3. Connect with GitHub/GitLab/Bitbucket or create an account
4. Create an organization
5. Generate a token in your profile settings

### Step 2: Configure Your Project
```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your credentials
# On Windows (PowerShell):
notepad .env

# On macOS/Linux:
nano .env
# OR
vim .env
```

**Required settings in `.env`:**
```
SONAR_HOST_URL=https://sonarcloud.io
SONAR_LOGIN=your_token_here
```

### Step 3: Run Analysis

#### Option A: Using the Helper Script (Recommended)

**Windows (PowerShell):**
```powershell
# First time setup (including dependencies)
.\run-sonar-analysis.ps1

# Subsequent runs (skip dependencies)
.\run-sonar-analysis.ps1 -SkipInstall
```

**macOS/Linux (Bash):**
```bash
# Make script executable
chmod +x run-sonar-analysis.sh

# Run analysis
./run-sonar-analysis.sh
```

#### Option B: Using npm Scripts

```bash
# Install dependencies (first time only)
npm run install:all

# Run full analysis
npm run analyze:sonar

# Or step by step:
npm run test:coverage:all   # Generate coverage reports
npm run analyze:sonar       # Run SonarQube analysis
```

#### Option C: Manual Command

```bash
sonar-scanner \
  -Dsonar.projectKey=Robel-Manoa_my-app \
  -Dsonar.sources=front/src,back/src \
  -Dsonar.host.url=https://sonarcloud.io \
  -Dsonar.login=your_token_here
```

### Step 4: View Results
After analysis completes, view your results at:
```
https://sonarcloud.io/dashboard?id=Robel-Manoa_my-app
```

---

## 📋 Checklist

- [ ] Created SonarCloud account
- [ ] Generated authentication token
- [ ] Created `.env` file
- [ ] Added token to `.env`
- [ ] Ran `npm run install:all` (or script)
- [ ] Successfully completed first analysis
- [ ] Viewed dashboard at SonarCloud
- [ ] Reviewed quality metrics
- [ ] Configured Quality Gates

---

## 🔧 Common Issues & Solutions

### ❌ "Not authorized" Error
```
Solution: Check your SONAR_LOGIN token in .env
- Verify token hasn't expired
- Regenerate token if needed
- Ensure correct SonarCloud organization
```

### ❌ "Coverage report not found"
```
Solution: Make sure tests ran successfully
- Run: npm run test:coverage:all
- Check: front/coverage/lcov.info exists
- Check: back/coverage/lcov.info exists
```

### ❌ sonar-scanner not found
```
Solution: Install sonar-scanner globally
- Run: npm install -g sonarqube-scanner
- Verify: sonar-scanner --version
```

### ❌ Tests are failing
```
Solution: Fix tests before analysis
- Run: npm test (in front and back directories)
- Fix failing tests
- Then run analysis again
```

---

## 📊 Key Metrics to Monitor

| Metric | Target | Check |
|--------|--------|-------|
| Quality Gate | ✅ PASSED | Dashboard |
| Coverage | > 80% | Dashboard |
| Security Issues | 0 Critical | Issues Tab |
| Duplications | < 5% | Metrics Tab |
| Maintainability | A or B | Dashboard |

---

## 🔄 Automated Analysis

### GitHub Actions
The project includes automated SonarQube analysis:
- **Trigger**: On push to main/dev or pull request
- **Frequency**: Every commit + daily schedule
- **Requirements**: Add `SONAR_TOKEN` to GitHub Secrets

```bash
# In GitHub repo settings:
# Settings > Secrets and variables > Actions
# Add: SONAR_TOKEN=your_token_here
```

---

## 📚 Learn More

- **Full Setup Guide**: See `SONARQUBE_SETUP.md`
- **Metrics Reference**: See `QUALITY_METRICS.md`
- **Configuration**: See `sonar-project.properties`

---

## 🎓 Understanding Your Results

### Quality Gate Status
- 🟢 **PASSED**: All thresholds met
- 🔴 **FAILED**: Some thresholds not met
- Actions: Fix issues listed in dashboard

### Coverage
- Shows % of code tested
- Lower is riskier
- Aim for 80%+

### Security Rating
- A = No vulnerabilities
- B-E = Issues to fix
- Critical = Fix immediately

### Duplications
- % of code that's repeated
- Lower is better
- Extract common code

### Maintainability
- A = Easy to maintain
- D-E = Difficult to maintain
- Refactor high-complexity code

---

## 💡 Tips for Success

1. **Run locally first**: Test on your machine before pushing
2. **Fix issues regularly**: Don't let them accumulate
3. **Write tests**: Improves coverage and code quality
4. **Review metrics weekly**: Track progress
5. **Use IDE plugins**: Install SonarLint in VS Code/IDE
6. **Follow best practices**: Check SonarQube rules and learn from them

---

## 🆘 Need Help?

- **SonarCloud Support**: https://docs.sonarcloud.io
- **SonarQube Rules**: https://rules.sonarsource.com
- **Community**: https://community.sonarsource.com

---

**Happy Coding! 🎉**

Remember: Code quality is a journey, not a destination. Aim for continuous improvement!
