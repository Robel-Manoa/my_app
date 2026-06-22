# SonarCloud Dashboard Navigation Guide

## 🎯 Accessing Each Metric

### Dashboard URL
```
https://sonarcloud.io/dashboard?id=Robel-Manoa_my-app
```

---

## 1. Quality Gate Status ✅

### Location
```
Main Dashboard → Top Center Card
```

### What You'll See
- 🟢 **PASSED** or 🔴 **FAILED** indicator
- Conditions that passed/failed
- Score breakdown

### To Fix
1. Click on status indicator
2. Review failing conditions
3. Fix issues listed
4. Re-run analysis

---

## 2. Open Issues 📋

### Location
```
Navigation Menu → Issues
```

### Filter Options
- **By Type**: Bug | Vulnerability | Code Smell
- **By Severity**: Blocker | Critical | Major | Minor | Info
- **By Status**: Open | Confirmed | False Positive | Won't Fix
- **By Component**: Front | Back

### Dashboard Card
- Shows total count
- Breakdown by type
- Recent additions

### To Review
1. Go to Issues tab
2. Sort by Severity (Critical first)
3. Fix each issue or mark accordingly

---

## 3. Duplications 📋

### Location
```
Main Dashboard → Duplications Card (right side)
```

### Information Shown
- **Percentage**: % of duplicated code
- **Duplicated Blocks**: Number of duplicate sections
- **Duplicated Lines**: Total lines duplicated

### Detailed View
```
Measures → Duplications
```

### Top Duplications
```
Duplications → Duplications List
```

### To Reduce
1. Identify duplicate code blocks
2. Extract to shared utilities/components
3. Use composition and inheritance patterns

---

## 4. Coverage 📊

### Location
```
Main Dashboard → Coverage Card
Main Dashboard → Line Coverage %
```

### Detailed Metrics
```
Measures → Coverage
```

Shows:
- **Line Coverage**: % of lines tested
- **Branch Coverage**: % of conditions tested
- **Function Coverage**: % of functions tested

### By Component
```
Components → Select front or back
→ Coverage section
```

### Coverage Files
```
Coverage → Detailed file-by-file breakdown
```

### To Improve
1. Go to files with low coverage
2. Review untested code paths
3. Add tests for critical sections
4. Run `npm run test:coverage:all`
5. Re-analyze

---

## 5. Security Rating 🔐

### Location
```
Main Dashboard → Security Card (top)
```

### Rating Scale
- 🟢 **A**: No vulnerabilities
- 🟡 **B**: Minor issues
- 🟠 **C**: Some issues
- 🔴 **D**: Major issues
- 🔴 **E**: Critical issues

### Details
```
Security → Vulnerabilities section
```

### To Improve
1. Check Security Hotspots
2. Review suggested fixes
3. Fix vulnerabilities
4. Run `npm audit fix`
5. Re-analyze

---

## 6. Security Issues 🛡️

### Location
```
Issues Tab → Filter by Type: Vulnerability
```

### Details
```
Security → Security Issues List
```

### Breakdown
```
Security → By Severity pie chart
```

### Critical View
```
Issues → Type = Vulnerability → Severity = Critical
```

### Action Items
1. Identify all Critical issues
2. Fix immediately
3. Verify fix with re-analysis
4. Document resolution

---

## 7. Open Security Issues by Severity 🚨

### Location
```
Main Dashboard → Security Card → Breakdown by Severity
```

### Details Tab
```
Issues → Filter:
  - Type: Vulnerability
  - Severity: (select each)
```

### View Chart
```
Security → Security Issues by Severity chart
```

### Metrics
- **Critical** 🔴: Count shown
- **Major** 🟠: Count shown
- **Minor** 🟡: Count shown
- **Info** 🔵: Count shown

### Priority Action
1. Fix all Critical (immediate)
2. Fix all Major (this sprint)
3. Fix Minor (next sprint)

---

## 8. Maintainability Issues 🔧

### Location
```
Issues Tab → Filter by Type: Code Smell
```

### Detailed View
```
Measures → Code Smells
```

### Details
```
Maintainability → Code Smells section
```

### Issue Breakdown
```
Issues → Code Smell issues listed
→ Click each to see details and suggestions
```

### Common Code Smells
- High cyclomatic complexity
- Duplicate code
- Long parameter lists
- Magic numbers
- Unused variables
- Dead code

### To Fix
1. Review each code smell
2. Refactor complex functions
3. Extract duplicated code
4. Use named constants
5. Remove unused code

---

## 9. Maintainability Rating 📈

### Location
```
Main Dashboard → Large Card (left side)
```

### Rating Display
- Shows current rating (A-F)
- Shows trend (↑ ↓ →)
- Shows previous period for comparison

### Detailed Breakdown
```
Measures → Maintainability
```

### Components
```
Components → Select front or back → Maintainability Rating
```

### Historical View
```
Activity → Maintainability Rating over time
```

### Target
- 🟢 **A** or 🟡 **B**: Maintain
- 🟠 **C**: Improve
- 🔴 **D/E**: Major refactoring needed

---

## 10. Maintainability Issues Over Time 📉

### Location
```
Activity Tab → Select metric: Maintainability Issues
```

### Chart View
```
Activity → Chart showing:
  - X-axis: Time (days/weeks)
  - Y-axis: Number of issues
  - Trend line
```

### Details
```
Activity → Review for:
  - Overall trend direction
  - Spike indicators
  - Improvement areas
```

### Time Periods
- Last 7 days: Recent performance
- Last 30 days: Monthly trend
- Last 90 days: Quarterly view
- Lifetime: Historical data

### Interpretation
- 📉 **Downward**: Improving (Good!)
- 📈 **Upward**: Increasing issues (Concerning)
- ➡️ **Flat**: No change (Stagnant)

### Action
1. If upward: Find cause and address
2. If downward: Continue current approach
3. If flat: Increase efforts

---

## 🔍 Navigation Tips

### Quick Access Buttons
- **Measures**: View detailed metrics
- **Issues**: See all issues
- **Components**: Drill down by file
- **Activity**: Historical trends
- **Security**: Security-specific metrics

### Filters Available
- **Severity**: Blocker → Minor
- **Status**: Open, Confirmed, False Positive
- **Type**: Bug, Vulnerability, Code Smell
- **Component**: Front, Back, Specific files
- **Date Range**: Custom date selection

### Export Options
- 📊 CSV export
- 📄 PDF reports
- 🔗 Custom URLs for sharing

---

## 📱 Mobile Access

Dashboard is responsive on mobile:
- All metrics visible
- Touch-friendly navigation
- Limited to essential info
- Full access via "Desktop" link

---

## 🔔 Notifications

### Enable Alerts
```
Profile → Notifications → Configure:
- Quality Gate failure
- New issues on project
- Security hotspots
```

### PR Comments
- Automatically added to PRs
- Shows analysis results
- Linked to full dashboard

---

## 📊 Setting Up Custom Dashboards

### Create Custom Dashboards
```
Your Projects → Select Project → Customize
```

### Available Widgets
- Quality Gate Status
- Metrics (all 10 metrics)
- Issues list
- Coverage chart
- Activity chart
- Security overview

### Sharing
- Share dashboard URL
- Share with team
- Embed in wiki/docs

---

## 🎯 Daily/Weekly Routine

### Daily (2 min)
1. Check dashboard home
2. Note Quality Gate status
3. Review any new issues

### Weekly (15 min)
1. Go to Issues tab
2. Filter Critical/Major
3. Plan fixes
4. Check trending metrics

### Monthly (30 min)
1. Full metrics review
2. Check coverage trend
3. Review maintainability rating
4. Plan next sprint improvements

---

## 🆘 Common Navigation Issues

### "Metrics don't show up"
- Solution: Run analysis first
- Check: sonar-project.properties correct
- Verify: Coverage files generated

### "Old data showing"
- Solution: Click "Refresh" or reload page
- Check: Latest analysis completed
- Wait: May take 5 minutes to update

### "Can't find component"
- Solution: Check sonar.sources path
- Verify: Files exist in that location
- Confirm: Analysis includes them

---

## 📚 SonarCloud Help

- **Help Icon**: Bottom right corner
- **Documentation**: Help menu
- **Status Page**: Status updates
- **Support**: Contact SonarSource

---

**Dashboard URL:**
```
https://sonarcloud.io/dashboard?id=Robel-Manoa_my-app
```

**Bookmark this page for quick access!**
