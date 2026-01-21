# CI/CD Guide - EPAM Interview Topics

## 🎯 CI/CD for Senior Level

---

## 1. What is CI/CD?

### Continuous Integration (CI)

**Automatically build and test code when changes are pushed.**

**Benefits:**

- Early bug detection
- Faster feedback
- Reduced integration problems
- Better code quality

**Key practices:**

- Commit code frequently
- Automated builds
- Automated tests
- Fast builds (< 10 minutes)

### Continuous Delivery (CD)

**Code is always in deployable state, manual deploy to production.**

### Continuous Deployment

**Automatically deploy to production after passing tests.**

```
Developer → Commit → CI Server → Build → Test → Deploy → Production
             ↓
          GitHub/GitLab
             ↓
       Jenkins/GitHub Actions
             ↓
        Run Tests (Unit, Integration, E2E)
             ↓
         Deploy to Staging
             ↓
        Deploy to Production (CD)
```

---

## 2. CI/CD Tools

### Jenkins

**Open-source automation server.**

**Jenkinsfile example:**

```groovy
pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test'
            }
        }

        stage('Lint') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Deploy to Staging') {
            when {
                branch 'develop'
            }
            steps {
                sh './deploy-staging.sh'
            }
        }

        stage('Deploy to Production') {
            when {
                branch 'main'
            }
            steps {
                input message: 'Deploy to production?'
                sh './deploy-production.sh'
            }
        }
    }

    post {
        success {
            slackSend color: 'good', message: "Build successful: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
        failure {
            slackSend color: 'danger', message: "Build failed: ${env.JOB_NAME} ${env.BUILD_NUMBER}"
        }
    }
}
```

### GitHub Actions

**CI/CD built into GitHub.**

**.github/workflows/ci.yml:**

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        node-version: [16.x, 18.x, 20.x]

    steps:
      - uses: actions/checkout@v3

      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Build
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json

  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to production
        env:
          DEPLOY_KEY: ${{ secrets.DEPLOY_KEY }}
        run: |
          ./deploy.sh production
```

### GitLab CI/CD

**.gitlab-ci.yml:**

```yaml
stages:
  - build
  - test
  - deploy

variables:
  NODE_VERSION: "18"

before_script:
  - npm ci

build:
  stage: build
  script:
    - npm run build
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

lint:
  stage: test
  script:
    - npm run lint

unit-tests:
  stage: test
  script:
    - npm test
  coverage: '/Lines\s*:\s*(\d+\.\d+)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml

e2e-tests:
  stage: test
  script:
    - npm run test:e2e

deploy-staging:
  stage: deploy
  script:
    - ./deploy.sh staging
  environment:
    name: staging
    url: https://staging.example.com
  only:
    - develop

deploy-production:
  stage: deploy
  script:
    - ./deploy.sh production
  environment:
    name: production
    url: https://example.com
  only:
    - main
  when: manual
```

---

## 3. Code Quality Practices

### Code Review

**Why:**

- Catch bugs early
- Knowledge sharing
- Maintain code standards
- Improve code quality

**Best practices:**

```markdown
## Code Review Checklist

### Functionality
- [ ] Code works as expected
- [ ] Edge cases handled
- [ ] Error handling in place

### Code Quality
- [ ] Follows coding standards
- [ ] No code smells
- [ ] DRY principle followed
- [ ] SOLID principles applied

### Testing
- [ ] Unit tests added
- [ ] Tests pass
- [ ] Coverage meets threshold

### Security
- [ ] No security vulnerabilities
- [ ] Input validation
- [ ] No hardcoded secrets

### Performance
- [ ] No performance issues
- [ ] Efficient algorithms
- [ ] Database queries optimized

### Documentation
- [ ] Code comments where needed
- [ ] README updated
- [ ] API docs updated
```

**How to review:**

```bash
# 1. Checkout PR branch
git fetch origin
git checkout pr-branch

# 2. Review changes
git diff main...pr-branch

# 3. Run tests locally
npm install
npm test

# 4. Test functionality
npm start

# 5. Leave comments on GitHub/GitLab
# 6. Approve or request changes
```

### Static Code Analysis

**Tools:**

- **ESLint** (JavaScript/TypeScript)
- **SonarQube** (Multiple languages)
- **Prettier** (Code formatter)
- **TypeScript** compiler

**ESLint config (.eslintrc.js):**

```javascript
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'prettier'
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    'no-console': 'warn',
    'no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    'complexity': ['error', 10],
    'max-lines-per-function': ['error', 50]
  }
};
```

**SonarQube integration:**

```yaml
# .github/workflows/sonar.yml
name: SonarQube Analysis

on:
  push:
    branches: [main, develop]
  pull_request:

jobs:
  sonarqube:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: SonarQube Scan
        uses: sonarsource/sonarqube-scan-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
          SONAR_HOST_URL: ${{ secrets.SONAR_HOST_URL }}

      - name: SonarQube Quality Gate
        uses: sonarsource/sonarqube-quality-gate-action@master
        timeout-minutes: 5
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

### Dynamic Code Analysis

**Runtime analysis:**

- Memory leaks
- Performance profiling
- Security vulnerabilities

```javascript
// package.json
{
  "scripts": {
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch",
    "analyze": "webpack-bundle-analyzer dist/stats.json"
  }
}
```

---

## 4. How to Review Pull Requests

### Review Process

**1. Understand the context:**

```markdown
- Read PR description
- Check linked issues/tickets
- Understand the problem being solved
```

**2. Check code changes:**

```bash
# View file changes
git diff main...feature-branch

# Check specific file
git show feature-branch:src/file.ts
```

**3. Test locally:**

```bash
git checkout feature-branch
npm install
npm test
npm run dev
```

**4. Leave constructive feedback:**

```markdown
❌ BAD:
"This code is wrong."

✅ GOOD:
"Consider using Array.map() instead of forEach() here
since we're creating a new array. Example:
const result = items.map(item => item.value);"
```

**5. Approve or request changes:**

- **Approve**: Code is ready to merge
- **Request changes**: Issues must be fixed
- **Comment**: Suggestions, not blocking

---

## 5. How to Merge Pull Requests

### Merge Strategies

**1. Merge Commit (default):**

```bash
git merge --no-ff feature-branch
# Creates merge commit, preserves history
```

**2. Squash and Merge:**

```bash
git merge --squash feature-branch
git commit -m "feat: implement feature X"
# Combines all commits into one
```

**3. Rebase and Merge:**

```bash
git rebase main
git checkout main
git merge feature-branch
# Linear history, no merge commit
```

**When to use:**

- **Merge commit**: Long-lived branches, preserve history
- **Squash**: Clean up messy commits
- **Rebase**: Clean, linear history

### Before Merging Checklist

```markdown
- [ ] All CI checks pass
- [ ] Code reviewed and approved
- [ ] Tests pass
- [ ] No merge conflicts
- [ ] Branch up to date with main
- [ ] Documentation updated
- [ ] Breaking changes communicated
```

---

## 6. Deployment Frequency

### How Often to Deploy?

**Industry standards:**

- **Elite performers**: Multiple deploys per day
- **High performers**: Once per day to once per week
- **Medium performers**: Once per week to once per month
- **Low performers**: Less than once per month

**Factors:**

- Team size
- Product maturity
- Risk tolerance
- Automation level

### Deployment Strategies

**1. Blue-Green Deployment:**

```
Blue (current production) ←→ Green (new version)
                               ↓
                          Test on Green
                               ↓
                     Switch traffic to Green
                               ↓
                     Blue becomes standby
```

**2. Canary Deployment:**

```
90% users → Old version
10% users → New version (canary)
             ↓
    Monitor metrics
             ↓
  Gradually increase to 100%
```

**3. Rolling Deployment:**

```
Update instances one by one:
[v1] [v1] [v1] [v1]
  ↓
[v2] [v1] [v1] [v1]
  ↓
[v2] [v2] [v1] [v1]
  ↓
[v2] [v2] [v2] [v1]
  ↓
[v2] [v2] [v2] [v2]
```

---

## 7. Staging Server

### Why Need Staging?

**Purpose:**

- Test in production-like environment
- Catch integration issues
- QA testing
- Client demos
- Performance testing

**Differences from production:**

- Use test data
- Lower traffic
- May have debug tools enabled
- Smaller infrastructure

**Environments:**

```
Development → Staging → Production
    ↓            ↓          ↓
 Local PC    QA Testing   Real Users
 Debug on     Similar     Production
              to Prod     Data
```

### Staging Deployment

```yaml
# .github/workflows/deploy-staging.yml
name: Deploy to Staging

on:
  push:
    branches: [develop]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Staging
        env:
          STAGING_SERVER: ${{ secrets.STAGING_SERVER }}
          STAGING_KEY: ${{ secrets.STAGING_KEY }}
        run: |
          ssh -i $STAGING_KEY user@$STAGING_SERVER '
            cd /var/www/app
            git pull origin develop
            npm install
            npm run build
            pm2 restart app
          '

      - name: Run Smoke Tests
        run: |
          npm run test:smoke -- --env=staging

      - name: Notify Team
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Staging deployment completed'
          webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## 8. CI/CD Pipeline Configuration

### Jenkins Setup

**Install Jenkins:**

```bash
# Docker
docker run -p 8080:8080 -p 50000:50000 jenkins/jenkins:lts

# Access at http://localhost:8080
```

**Create Job:**

1. New Item → Pipeline
2. Add Git repository
3. Add Jenkinsfile path
4. Configure webhooks
5. Save and build

**Jenkins Plugins:**

- Git Plugin
- Pipeline Plugin
- NodeJS Plugin
- Docker Plugin
- Slack Notification Plugin

### GitHub Actions Setup

**Enable Actions:**

1. Go to repository Settings
2. Actions → General
3. Allow all actions
4. Create `.github/workflows/` directory
5. Add YAML files

**Secrets:**

1. Settings → Secrets and variables → Actions
2. New repository secret
3. Add: `DEPLOY_KEY`, `API_TOKEN`, etc.

---

## 9. Testing Pyramid

```
           /\
          /  \
         / E2E \      ← Few, slow, expensive
        /______\
       /        \
      / Integration\  ← More, medium speed
     /____________\
    /              \
   /  Unit Tests    \ ← Many, fast, cheap
  /__________________\
```

### Unit Tests

**Purpose:** Test individual functions/classes

```javascript
// sum.test.js
import { sum } from './sum';

describe('sum', () => {
  it('should add two numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(sum(-1, 1)).toBe(0);
  });
});
```

### Integration Tests

**Purpose:** Test modules working together

```javascript
// api.test.js
import request from 'supertest';
import app from './app';

describe('POST /users', () => {
  it('should create a user', async () => {
    const response = await request(app)
      .post('/users')
      .send({ name: 'John', email: 'john@example.com' })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John');
  });
});
```

### E2E Tests

**Purpose:** Test complete user flows

```javascript
// login.e2e.js (Playwright)
import { test, expect } from '@playwright/test';

test('user can login', async ({ page }) => {
  await page.goto('https://example.com/login');

  await page.fill('[name="email"]', 'user@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Welcome');
});
```

### Test Coverage

```javascript
// package.json
{
  "scripts": {
    "test": "jest",
    "test:coverage": "jest --coverage",
    "test:watch": "jest --watch"
  },
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

**Coverage in CI:**

```yaml
- name: Run tests with coverage
  run: npm run test:coverage

- name: Upload coverage to Codecov
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
    fail_ci_if_error: true
```

---

## 10. Automated Testing

### Test Automation Tools

**Unit Testing:**

- Jest (JavaScript/TypeScript)
- Mocha + Chai
- Vitest

**E2E Testing:**

- Playwright
- Cypress
- Selenium

**API Testing:**

- Supertest
- Postman (Newman)
- REST Assured

### CI Pipeline with Tests

```yaml
name: Full Test Suite

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:unit

      - name: Run integration tests
        run: npm run test:integration
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Upload test results
        if: always()
        uses: actions/upload-artifact@v3
        with:
          name: test-results
          path: test-results/
```

---

## 🎯 Interview Quick Tips

**Be ready to explain:**

- Difference between CI and CD
- What happens in a typical CI/CD pipeline
- How to review pull requests
- Different merge strategies
- Why use staging environment
- Testing pyramid concept
- How to set up Jenkins/GitHub Actions
- Code quality practices

**Common questions:**

- "How often should we deploy to production?"
  - Depends on team maturity, automation level, and risk tolerance. Elite teams deploy multiple times per day.

- "What's the difference between blue-green and canary deployment?"
  - Blue-green switches all traffic at once, canary gradually increases traffic to new version.

- "How do you ensure code quality?"
  - Code reviews, static analysis (ESLint, SonarQube), automated tests, CI/CD pipelines, coverage thresholds.

- "Describe your ideal CI/CD pipeline"
  - Commit → Build → Lint → Unit tests → Integration tests → E2E tests → Deploy to staging → Manual approval → Deploy to production → Monitor

Good luck! 🚀
