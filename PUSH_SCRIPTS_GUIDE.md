# Push Scripts Usage Guide

This guide explains how to use the git push automation scripts in AETERNAAA.

## 📋 Available Scripts

### 1. `push-all-branches.sh` (Linux/Mac)
Interactive script that pushes your current branch to all configured git remotes.

**Usage:**
```bash
./scripts/push-all-branches.sh
```

**Features:**
- Detects your current branch automatically
- Checks for uncommitted changes in tracked files
- Prompts to commit changes if needed (with validation)
- Pushes to all configured remotes
- Provides detailed summary of successes and failures
- Safe error handling (continues trying all remotes even if one fails)

### 2. `push-all-branches.ps1` (Windows)
PowerShell version with identical functionality for Windows users.

**Usage:**
```powershell
.\scripts\push-all-branches.ps1
```

### 3. `push-current-branch.sh` (Non-interactive)
Simple wrapper for CI/CD pipelines and automation scripts.

**Usage:**
```bash
# Push to default remote (origin)
./scripts/push-current-branch.sh

# Push to specific remote
./scripts/push-current-branch.sh upstream
```

**Features:**
- No user prompts (suitable for automation)
- Validates remote exists before pushing
- Returns appropriate exit codes (0 for success, 1 for failure)

## 🎯 Use Cases

### Development Workflow
When you've made changes and want to push to all remotes:

```bash
# Make your changes
git add .
git commit -m "Your changes"

# Push to all remotes
./scripts/push-all-branches.sh
```

### Quick Push Without Prior Commit
The script can commit for you:

```bash
# Make your changes
# Run the script
./scripts/push-all-branches.sh

# When prompted:
# - Answer "y" to commit
# - Enter your commit message
# - Script will commit and push to all remotes
```

### CI/CD Pipeline
Use the non-interactive script in your CI/CD workflows:

```bash
# In your CI/CD script
./scripts/push-current-branch.sh origin
```

## ⚙️ Configuration

### Adding Multiple Remotes
To push to multiple repositories, add them as remotes:

```bash
# Add a second remote
git remote add backup https://github.com/user/backup-repo.git

# Add a third remote
git remote add mirror https://gitlab.com/user/mirror-repo.git

# Now push-all-branches.sh will push to all three
./scripts/push-all-branches.sh
```

### View Configured Remotes
```bash
git remote -v
```

## 🔒 Security Notes

- The scripts only stage tracked files (`git add -u`) to avoid accidentally committing sensitive data
- Commit messages must be non-empty
- Authentication is handled by your git credential manager
- Failed pushes don't stop the script from trying other remotes

## 🐛 Troubleshooting

### Authentication Failures
If you see authentication errors:

1. Ensure your git credentials are configured:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

2. For HTTPS remotes, you may need a personal access token:
   ```bash
   git remote set-url origin https://username:TOKEN@github.com/user/repo.git
   ```

3. For SSH remotes, ensure your SSH keys are set up:
   ```bash
   ssh-add ~/.ssh/id_rsa
   ```

### Permission Errors
If you can't execute the script:
```bash
chmod +x scripts/push-all-branches.sh
chmod +x scripts/push-current-branch.sh
```

### Branch Protection
Some remotes may have branch protection rules. The script will report these as failures but continue with other remotes.

## 📊 Output Example

```
🚀 AETERNAAA - Push All in Current Branch

📍 Current branch: main

📡 Configured remotes:
  ✓ origin: https://github.com/QAntum-Fortres/AETERNAAA
  ✓ backup: https://github.com/QAntum-Fortres/AETERNAAA-backup

⬆️  Pushing to origin...
✅ Successfully pushed to origin

⬆️  Pushing to backup...
✅ Successfully pushed to backup

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 Push Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Branch: main
  Success: 2
  Failed: 0
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎉 All pushes completed successfully!
```

## 💡 Tips

1. **Test First**: Run `git remote -v` to see where you'll be pushing
2. **Dry Run**: Check your changes with `git status` and `git diff` before pushing
3. **Selective Remotes**: If you only want to push to one remote, use standard `git push origin branch-name`
4. **Branch Names**: The script automatically detects your current branch
5. **Error Handling**: The script continues even if one remote fails, so you can see all results

---

**Note**: AETERNAAA is intentional branding (triple A for emphasis) representing the sovereign cognitive entity.
