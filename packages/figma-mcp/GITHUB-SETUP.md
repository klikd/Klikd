# 🔐 GitHub Actions Setup Guide

This guide will help you set up GitHub Actions to automatically sync your design system with Figma.

## 📋 Prerequisites

- ✅ GitHub repository with admin access
- ✅ Figma Personal Access Token
- ✅ Figma file key (already configured: `2M5cftWvofNAYTV5yuFVkY`)

## 🔑 Step 1: Add GitHub Secrets

### **Navigate to your repository settings:**
1. Go to your GitHub repository
2. Click **Settings** tab
3. Click **Secrets and variables** → **Actions** in the left sidebar

### **Add the required secret:**

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `FIGMA_ACCESS_TOKEN` | `figd_4CXyVWUp6uPntFBpcN6pXZ2oKo2fJ81COn30_igH` | Your Figma Personal Access Token |

### **How to add the secret:**
1. Click **New repository secret**
2. **Name**: `FIGMA_ACCESS_TOKEN`
3. **Value**: `figd_4CXyVWUp6uPntFBpcN6pXZ2oKo2fJ81COn30_igH`
4. Click **Add secret**

## 🔐 Step 2: Configure Repository Permissions

### **Enable Actions permissions:**
1. Go to **Settings** → **Actions** → **General**
2. Under **Actions permissions**, select **Allow all actions and reusable workflows**
3. Under **Workflow permissions**, select **Read and write permissions**
4. Check **Allow GitHub Actions to create and approve pull requests**
5. Click **Save**

### **Why these permissions are needed:**
- **Read and write permissions**: Allows the action to commit generated design tokens
- **Pull request creation**: Enables automated design system updates
- **Workflow permissions**: Allows the action to run and modify files

## 🚀 Step 3: Test the Workflow

### **Manual trigger (recommended for first run):**
1. Go to **Actions** tab in your repository
2. Click **🎨 Design System Auto-Sync** workflow
3. Click **Run workflow**
4. Select your branch (e.g., `main`)
5. Optionally modify inputs:
   - **Figma file key**: `2M5cftWvofNAYTV5yuFVkY` (default)
   - **Force sync**: `true` (to test even without changes)
   - **Generate all formats**: `true` (default)
6. Click **Run workflow**

### **Expected workflow steps:**
1. ✅ Checkout code
2. ✅ Setup Node.js
3. ✅ Install pnpm
4. ✅ Install dependencies
5. ✅ Build Figma MCP package
6. ✅ Check for design system changes
7. ✅ Run design system sync
8. ✅ Generate sync report
9. ✅ Upload design system artifacts
10. ✅ Commit updated design tokens
11. ✅ Push design system updates
12. ✅ Sync completed

## 🔍 Step 4: Monitor and Debug

### **Check workflow logs:**
- Click on the workflow run
- Click on the **sync-design-system** job
- Expand each step to see detailed logs

### **Common issues and solutions:**

#### **Issue: "FIGMA_ACCESS_TOKEN not found"**
**Solution**: Verify the secret name is exactly `FIGMA_ACCESS_TOKEN`

#### **Issue: "Permission denied"**
**Solution**: Check repository permissions in Settings → Actions → General

#### **Issue: "Workflow failed to push changes"**
**Solution**: Ensure the workflow has write permissions to the repository

#### **Issue: "No changes detected"**
**Solution**: Use `force_sync: true` in manual workflow runs for testing

## 📊 Step 5: Verify Success

### **Check generated artifacts:**
1. Go to the workflow run
2. Scroll down to **Artifacts**
3. Download `design-system-output-{number}`
4. Verify files are generated:
   - `design-tokens.json`
   - `klikd-tokens.ts`
   - `sync-report.md`
   - Category-specific token files

### **Check repository changes:**
1. Go to **Commits** tab
2. Look for commit: "🤖 Auto-sync design system tokens [skip ci]"
3. Verify `design-system-output/` folder is updated

## 🔄 Step 6: Automatic Triggers

### **The workflow will now automatically run on:**
- ✅ **Push** to `main`, `develop`, or `feature/*` branches
- ✅ **Pull requests** to `main` or `develop` branches
- ✅ **Daily schedule** at 2 AM UTC
- ✅ **Manual trigger** with custom options

### **Path-based triggers:**
The workflow only runs when these paths change:
- `apps/**/src/design/**`
- `apps/**/src/components/**`
- `packages/design-system/**`
- `packages/figma-mcp/**`
- `**/KlikdBrandSystem.*`
- `**/design-system.*`

## 🎯 Step 7: Integration with Development

### **Your build process now includes design system sync:**
```bash
# Build with design system sync (default)
pnpm build

# Build without design system sync (fast)
pnpm build:fast

# Development with auto-sync
pnpm design:dev

# Manual design system sync
pnpm design:sync
```

### **CI/CD pipeline integration:**
The workflow automatically:
- ✅ Syncs design system on code changes
- ✅ Generates all output formats
- ✅ Commits and pushes updates
- ✅ Creates detailed sync reports
- ✅ Uploads artifacts for review

## 🔧 Advanced Configuration

### **Customize workflow triggers:**
Edit `.github/workflows/design-system-sync.yml`:
- Modify `paths` filters
- Adjust `cron` schedule
- Add new trigger conditions

### **Environment-specific settings:**
```yaml
# Add environment-specific configurations
env:
  FIGMA_FILE_KEY: ${{ github.event.inputs.figma_file_key || '2M5cftWvofNAYTV5yuFVkY' }}
  NODE_ENV: production
  DEBUG: false
```

### **Branch protection:**
Consider protecting your main branch:
1. Go to **Settings** → **Branches**
2. Add rule for `main` branch
3. Require status checks to pass
4. Include the design system workflow

## 🎉 Success!

Once configured, your design system will automatically:
- 🔄 Sync with Figma on every design change
- 📝 Generate type-safe design tokens
- 🎨 Export to multiple formats (CSS, SCSS, TypeScript)
- 📚 Create Storybook configurations
- 🤖 Commit and push updates automatically
- 📊 Generate detailed sync reports

## 🆘 Troubleshooting

### **Still having issues?**
1. Check workflow logs for specific error messages
2. Verify all secrets are correctly set
3. Ensure repository permissions are enabled
4. Test with manual workflow trigger
5. Check Figma API token permissions

### **Need help?**
- Review the workflow logs
- Check the `AUTO-SYNC-README.md` for detailed usage
- Verify your Figma file permissions
- Ensure your token has the correct scopes

---

**🎯 Your GitHub Actions are now configured for automatic design system syncing!**
