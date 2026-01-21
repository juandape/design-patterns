# Git Advanced Guide - EPAM Interview Topics

## 🎯 Git for Senior Level

---

## 1. Basic Commands Review

### Clone, Commit, Push, Pull

```bash
# Clone repository
git clone https://github.com/user/repo.git
git clone git@github.com:user/repo.git  # SSH

# Check status
git status

# Add files
git add file.txt
git add .  # All files
git add -A  # All files including deleted

# Commit
git commit -m "Add feature X"
git commit -am "Add and commit tracked files"

# Push
git push origin main
git push -u origin feature-branch  # Set upstream

# Pull
git pull origin main
git pull --rebase origin main  # Rebase instead of merge
```

---

## 2. Checkout and Branching

### Checkout

```bash
# Switch to branch
git checkout main
git checkout feature-branch

# Create and switch to new branch
git checkout -b new-feature

# Checkout specific file from another branch
git checkout main -- file.txt

# Checkout specific commit
git checkout abc1234

# Return to previous branch
git checkout -
```

### Branching

```bash
# List branches
git branch  # Local branches
git branch -r  # Remote branches
git branch -a  # All branches

# Create branch
git branch feature-x

# Delete branch
git branch -d feature-x  # Safe delete (merged only)
git branch -D feature-x  # Force delete

# Rename branch
git branch -m old-name new-name

# Track remote branch
git checkout --track origin/feature-x
```

---

## 3. Fetch vs Pull

### Fetch

**Downloads changes but doesn't merge:**

```bash
# Fetch from origin
git fetch origin

# Fetch all remotes
git fetch --all

# Fetch and prune deleted remote branches
git fetch --prune

# View fetched changes
git log origin/main
git diff origin/main
```

### Pull

**Fetch + Merge:**

```bash
# Pull from origin/main
git pull origin main

# Pull with rebase (cleaner history)
git pull --rebase origin main

# Pull all branches
git pull --all
```

**Difference:**

- `fetch`: Safe, downloads changes without modifying your code
- `pull`: Downloads and merges/rebases automatically

---

## 4. Gitignore

### .gitignore syntax

```bash
# Ignore specific file
config.env

# Ignore all .log files
*.log

# Ignore directory
node_modules/
dist/

# Ignore files in any directory
**/*.tmp

# Except specific file
!important.log

# Ignore files only in root
/debug.log

# Comments
# This is a comment
```

### Common .gitignore

```bash
# Node.js
node_modules/
npm-debug.log
.env
.env.local

# Python
__pycache__/
*.py[cod]
venv/
.pytest_cache/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Build outputs
dist/
build/
*.out
```

### Remove already-tracked files

```bash
# Remove from git but keep locally
git rm --cached file.txt
git rm -r --cached node_modules/

# Commit the removal
git commit -m "Remove ignored files"
```

---

## 5. Merge Conflicts

### Resolving Conflicts

```bash
# When pulling/merging causes conflict
git pull origin main
# CONFLICT (content): Merge conflict in file.txt

# View conflicts
git status

# File will look like:
<<<<<<< HEAD
Your changes
=======
Incoming changes
>>>>>>> branch-name

# Resolve manually, then:
git add file.txt
git commit -m "Resolve merge conflict"
```

### Conflict Resolution Strategies

```bash
# Keep your version
git checkout --ours file.txt

# Keep their version
git checkout --theirs file.txt

# Abort merge
git merge --abort

# Use merge tool
git mergetool
```

---

## 6. Revert Commits

### Revert (Creates new commit)

```bash
# Revert last commit
git revert HEAD

# Revert specific commit
git revert abc1234

# Revert multiple commits
git revert HEAD~3..HEAD

# Revert without committing
git revert --no-commit HEAD
```

### Reset (Rewrites history)

```bash
# Soft reset (keep changes staged)
git reset --soft HEAD~1

# Mixed reset (keep changes unstaged) - DEFAULT
git reset HEAD~1
git reset --mixed HEAD~1

# Hard reset (discard all changes) - DANGEROUS
git reset --hard HEAD~1

# Reset to specific commit
git reset --hard abc1234
```

**When to use:**

- `revert`: Public branches (preserves history)
- `reset`: Local commits not pushed yet

---

## 7. Amend Commits

### Update Last Commit

```bash
# Change commit message
git commit --amend -m "New message"

# Add forgotten files to last commit
git add forgotten-file.txt
git commit --amend --no-edit

# Change author
git commit --amend --author="Name <email@example.com>"
```

**⚠️ Warning:** Never amend commits that have been pushed to shared branches!

---

## 8. Cherry-Pick

### Apply Specific Commits

```bash
# Apply commit from another branch
git cherry-pick abc1234

# Apply multiple commits
git cherry-pick abc1234 def5678

# Apply without committing
git cherry-pick --no-commit abc1234

# Continue after resolving conflicts
git cherry-pick --continue

# Abort cherry-pick
git cherry-pick --abort
```

**Use case:** You need one specific commit from another branch without merging everything.

```bash
# Example: Fix is on develop, you need it on main
git checkout main
git cherry-pick <commit-hash-from-develop>
```

---

## 9. Rebase

### What is Rebase?

**Reapplies commits on top of another base:**

```bash
# Rebase feature branch onto main
git checkout feature-branch
git rebase main

# Interactive rebase (last 3 commits)
git rebase -i HEAD~3

# Interactive rebase options:
# pick = use commit
# reword = change commit message
# edit = edit commit
# squash = merge with previous commit
# fixup = like squash but discard message
# drop = remove commit
```

### Rebase vs Merge

```bash
# Merge (creates merge commit)
git checkout main
git merge feature-branch
# Creates: ---A---B---C---M (merge commit)

# Rebase (linear history)
git checkout feature-branch
git rebase main
# Creates: ---A---B---C'---D'---E' (rebased commits)
```

**When to use:**

- **Rebase**: Clean up local commits before pushing
- **Merge**: Integrate feature branches on shared branches

### Squash Commits

```bash
# Squash last 3 commits into 1
git rebase -i HEAD~3

# In editor, change:
pick abc1234 Commit 1
pick def5678 Commit 2
pick ghi9012 Commit 3

# To:
pick abc1234 Commit 1
squash def5678 Commit 2
squash ghi9012 Commit 3

# Save and edit commit message
```

### Resolve Rebase Conflicts

```bash
# During rebase, conflicts occur
git rebase main
# CONFLICT...

# Resolve conflicts, then:
git add file.txt
git rebase --continue

# Skip commit
git rebase --skip

# Abort rebase
git rebase --abort
```

---

## 10. Tags

### Create Tags

```bash
# Lightweight tag
git tag v1.0.0

# Annotated tag (recommended)
git tag -a v1.0.0 -m "Release version 1.0.0"

# Tag specific commit
git tag -a v0.9.0 abc1234 -m "Version 0.9.0"

# List tags
git tag
git tag -l "v1.*"

# View tag info
git show v1.0.0
```

### Push Tags

```bash
# Push specific tag
git push origin v1.0.0

# Push all tags
git push origin --tags

# Delete tag locally
git tag -d v1.0.0

# Delete tag remotely
git push origin --delete v1.0.0
```

---

## 11. SSH vs HTTPS

### HTTPS

```bash
# Clone with HTTPS
git clone https://github.com/user/repo.git

# Requires username/password or token
# Easier setup, works behind firewalls
```

### SSH

```bash
# Generate SSH key
ssh-keygen -t ed25519 -C "your_email@example.com"

# Add to ssh-agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key
cat ~/.ssh/id_ed25519.pub
# Add to GitHub/GitLab settings

# Clone with SSH
git clone git@github.com:user/repo.git

# Switch remote from HTTPS to SSH
git remote set-url origin git@github.com:user/repo.git
```

**Advantages:**

- No password prompts
- More secure
- Required for some operations

---

## 12. Configuration

### User Config

```bash
# Global config
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Repository-specific
git config user.name "Work Name"
git config user.email "work@company.com"

# View config
git config --list
git config user.name

# Edit config file
git config --global --edit
```

### Aliases

```bash
# Create aliases
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.ci commit
git config --global alias.st status
git config --global alias.last 'log -1 HEAD'
git config --global alias.lg "log --oneline --graph --all"

# Use aliases
git co main
git st
```

### Other Useful Configs

```bash
# Default branch name
git config --global init.defaultBranch main

# Editor
git config --global core.editor "code --wait"

# Line endings
git config --global core.autocrlf input  # macOS/Linux
git config --global core.autocrlf true   # Windows

# Color
git config --global color.ui auto
```

---

## 13. Hooks

### What are Hooks?

**Scripts that run automatically on git events.**

Located in `.git/hooks/`

### Common Hooks

**pre-commit**: Run before commit

```bash
#!/bin/sh
# .git/hooks/pre-commit

# Run linter
npm run lint
if [ $? -ne 0 ]; then
  echo "Linting failed. Commit aborted."
  exit 1
fi

# Run tests
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Commit aborted."
  exit 1
fi
```

**commit-msg**: Validate commit message

```bash
#!/bin/sh
# .git/hooks/commit-msg

commit_msg=$(cat "$1")

# Enforce conventional commits
if ! echo "$commit_msg" | grep -qE "^(feat|fix|docs|style|refactor|test|chore): .+"; then
  echo "Invalid commit message format."
  echo "Use: feat|fix|docs|style|refactor|test|chore: message"
  exit 1
fi
```

**pre-push**: Run before push

```bash
#!/bin/sh
# .git/hooks/pre-push

# Run tests before push
npm test
if [ $? -ne 0 ]; then
  echo "Tests failed. Push aborted."
  exit 1
fi
```

**post-merge**: Run after merge

```bash
#!/bin/sh
# .git/hooks/post-merge

# Install dependencies if package.json changed
if git diff-tree -r --name-only --no-commit-id ORIG_HEAD HEAD | grep --quiet "package.json"; then
  echo "package.json changed. Running npm install..."
  npm install
fi
```

### Using Husky (Recommended)

```bash
# Install husky
npm install --save-dev husky

# Initialize
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "npm test"

# Add commit-msg hook
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
```

---

## 14. Branching Strategies

### Git Flow

```
main (production)
  └── develop (integration)
       ├── feature/user-auth
       ├── feature/payment
       └── release/1.0.0
            └── hotfix/critical-bug
```

**Branches:**

- `main`: Production-ready code
- `develop`: Integration branch
- `feature/*`: New features
- `release/*`: Release preparation
- `hotfix/*`: Production fixes

```bash
# Create feature
git checkout -b feature/user-auth develop

# Finish feature
git checkout develop
git merge --no-ff feature/user-auth
git branch -d feature/user-auth

# Create release
git checkout -b release/1.0.0 develop

# Finish release
git checkout main
git merge --no-ff release/1.0.0
git tag -a v1.0.0
git checkout develop
git merge --no-ff release/1.0.0
git branch -d release/1.0.0
```

### GitHub Flow (Simpler)

```
main (production)
  ├── feature/user-auth
  └── feature/payment
```

**Workflow:**

1. Create branch from `main`
2. Make changes and commit
3. Open Pull Request
4. Review and discuss
5. Merge to `main`
6. Deploy

```bash
# Create feature
git checkout -b feature/user-auth main

# Push and create PR
git push -u origin feature/user-auth
# Open PR on GitHub

# After approval
git checkout main
git pull origin main
```

### Trunk-Based Development

**Single `main` branch, short-lived feature branches:**

```bash
# Create short-lived branch
git checkout -b feature/quick-fix main

# Commit and push same day
git commit -m "feat: add quick fix"
git push origin feature/quick-fix

# Merge via PR within 24 hours
# Use feature flags for incomplete features
```

---

## 15. Advanced Commands

### Stash

```bash
# Save changes temporarily
git stash
git stash save "WIP: feature X"

# List stashes
git stash list

# Apply last stash
git stash apply
git stash pop  # Apply and remove

# Apply specific stash
git stash apply stash@{2}

# Delete stash
git stash drop stash@{0}
git stash clear  # Delete all
```

### Reflog

```bash
# View all ref updates
git reflog

# Recover lost commit
git reflog
# Find commit hash
git checkout abc1234
git cherry-pick abc1234
```

### Bisect (Find Bug)

```bash
# Start bisect
git bisect start
git bisect bad  # Current commit is bad
git bisect good abc1234  # Last known good commit

# Git will checkout commits for you to test
# After testing each:
git bisect good  # If works
git bisect bad   # If broken

# When found
git bisect reset
```

### Blame

```bash
# See who changed each line
git blame file.txt

# Show specific lines
git blame -L 10,20 file.txt

# Ignore whitespace changes
git blame -w file.txt
```

---

## 🎯 Interview Quick Tips

**Be ready to explain:**

- Difference between merge and rebase
- When to use cherry-pick
- How to resolve merge conflicts
- Git flow vs GitHub flow
- Difference between fetch and pull
- How git hooks work
- SSH vs HTTPS authentication
- How to undo commits (revert vs reset)

**Common scenarios:**

- "How do you update your feature branch with latest main?"
  - `git checkout feature && git rebase main`
- "How do you squash commits before merging?"
  - `git rebase -i HEAD~3`
- "How do you undo a pushed commit?"
  - `git revert <commit>` (safe for shared branches)
- "How do you recover a deleted branch?"
  - `git reflog` → `git checkout -b branch-name <commit>`

Good luck! 🚀
