# GitHub Setup Instructions

## Step 1: Create a GitHub Repository

1. Go to https://github.com and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Repository name: `rbac-configurator` (or any name you prefer)
5. Description: "Role-Based Access Control Management Tool"
6. Choose **Public** or **Private**
7. **DO NOT** initialize with README, .gitignore, or license (we already have these)
8. Click "Create repository"

## Step 2: Push Your Code to GitHub

After creating the repository, GitHub will show you commands. Use these:

```bash
# Add the remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/rbac-configurator.git

# Rename the default branch to main (if needed)
git branch -M main

# Push your code
git push -u origin main
```

## Alternative: Using SSH (if you have SSH keys set up)

```bash
git remote add origin git@github.com:YOUR_USERNAME/rbac-configurator.git
git branch -M main
git push -u origin main
```

## Step 3: Verify

1. Go to your GitHub repository page
2. You should see all your files
3. Make sure `.env` is NOT visible (it should be ignored by .gitignore)

## Important Notes

⚠️ **Never commit your `.env` file!** It contains sensitive information like:
- Database credentials
- JWT secret

The `.gitignore` file already excludes `.env`, so it won't be committed.

## Adding Environment Variables to GitHub (for deployment)

If you deploy to Vercel or another platform, you'll need to add environment variables there:

1. Go to your deployment platform's settings
2. Add these environment variables:
   - `DATABASE_URL` - Your database connection string
   - `JWT_SECRET` - Your JWT secret key
   - `NEXT_PUBLIC_APP_URL` - Your app URL (optional)

## Future Commits

After making changes:

```bash
git add .
git commit -m "Description of your changes"
git push
```

