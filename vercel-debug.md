# Vercel Debugging Steps

## Check Vercel Logs

1. Go to your Vercel dashboard
2. Click on your project
3. Go to the "Deployments" tab
4. Click on the latest deployment
5. Click on "Functions" tab or "Logs" tab
6. Look for error messages related to:
   - Database connection
   - Prisma Client
   - Environment variables

## Common Issues on Vercel

1. **DATABASE_URL not set correctly**
   - Check Environment Variables in Vercel Settings
   - Make sure it's set for Production environment
   - Should be: postgresql://neondb_owner:npg_7QaScq8NYrhj@ep-super-heart-adilnnxg-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

2. **JWT_SECRET not set**
   - Should be: rbac-secret-key-change-in-production-2024

3. **Prisma Client not generated**
   - We added "prisma generate" to build script - should be fixed

4. **Connection pooling issues**
   - Neon connection string should include "pooler" in the URL (yours does!)

## To check logs:
- Vercel Dashboard > Your Project > Functions tab > Click on /api/auth/login > See real-time logs
