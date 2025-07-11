# Deployment Checklist

## Pre-Deployment Steps

### 1. Update Repository Information
- [ ] Update the repository URL in `package.json` with your actual GitHub username
- [ ] Update the author name in `package.json`
- [ ] Update the live demo URL in `README.md` with your Netlify app name

### 2. Environment Variables
Make sure you have these environment variables ready:
- [ ] `DATABASE_URL` - Your Neon PostgreSQL connection string
- [ ] `VITE_ADMIN_USERNAME` - Your admin username
- [ ] `VITE_ADMIN_PASSWORD` - Your admin password

### 3. Database Setup
- [ ] Ensure your Neon database is running
- [ ] Run migrations: `npm run db:migrate`
- [ ] Test database connection locally

## GitHub Deployment

### 1. Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: Loan Management Application"
```

### 2. Create GitHub Repository
1. Go to [GitHub](https://github.com)
2. Click "New repository"
3. Name it `loan-management-app`
4. Make it public or private (your choice)
5. Don't initialize with README (we already have one)

### 3. Push to GitHub
```bash
git remote add origin https://github.com/yourusername/loan-management-app.git
git branch -M main
git push -u origin main
```

## Netlify Deployment

### 1. Connect to Netlify
1. Go to [Netlify](https://netlify.com)
2. Sign up/Login with your GitHub account
3. Click "New site from Git"
4. Choose GitHub as your Git provider
5. Select your `loan-management-app` repository

### 2. Configure Build Settings
Netlify should auto-detect these settings from `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **Node version**: 18

### 3. Set Environment Variables
In Netlify dashboard:
1. Go to Site Settings > Environment Variables
2. Add the following variables:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `VITE_ADMIN_USERNAME`: Your admin username
   - `VITE_ADMIN_PASSWORD`: Your admin password

### 4. Deploy
1. Click "Deploy site"
2. Wait for the build to complete
3. Your site will be available at `https://your-app-name.netlify.app`

## Post-Deployment Verification

### 1. Test the Application
- [ ] Visit your Netlify URL
- [ ] Test login functionality
- [ ] Test all CRUD operations (borrowers, loans, installments)
- [ ] Test the password-protected stats toggle
- [ ] Verify database connections work

### 2. Update Documentation
- [ ] Update the live demo URL in README.md
- [ ] Update repository URL in package.json
- [ ] Test all links in README.md

### 3. Security Check
- [ ] Ensure `.env` file is not committed to GitHub
- [ ] Verify environment variables are set in Netlify
- [ ] Test authentication works correctly

## Troubleshooting

### Common Issues

1. **Build Fails**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are in package.json
   - Check for TypeScript errors

2. **Database Connection Issues**
   - Verify DATABASE_URL is correct in Netlify
   - Check if Neon database is accessible from Netlify
   - Ensure database migrations are applied

3. **Authentication Issues**
   - Verify VITE_ADMIN_USERNAME and VITE_ADMIN_PASSWORD are set
   - Check browser console for errors
   - Clear browser cache and localStorage

4. **Routing Issues**
   - Verify netlify.toml redirects are working
   - Check if React Router is configured correctly

### Useful Commands
```bash
# Test build locally
npm run build

# Check for TypeScript errors
npx tsc --noEmit

# Run linting
npm run lint

# Test database connection
npm run db:studio
```

## Maintenance

### Regular Tasks
- [ ] Keep dependencies updated
- [ ] Monitor database usage
- [ ] Check for security updates
- [ ] Backup database regularly

### Updates
1. Make changes locally
2. Test thoroughly
3. Commit and push to GitHub
4. Netlify will automatically redeploy

---

**Note**: Replace `yourusername` and `your-app-name` with your actual values throughout this document. 