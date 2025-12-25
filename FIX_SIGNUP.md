# Fix Signup Issue - Database Connection

## The Problem
Your `.env` file has incorrect database credentials. The signup is failing because it can't connect to PostgreSQL.

## Quick Fix Options

### Option 1: Use Neon (Free Cloud Database) - RECOMMENDED ⚡

1. **Go to https://neon.tech and sign up (free)**

2. **Create a new project:**
   - Click "New Project"
   - Name it "rbac-assignment"
   - Choose a region close to you
   - Click "Create Project"

3. **Copy the connection string:**
   - In your Neon dashboard, you'll see a connection string like:
   ```
   postgresql://username:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require
   ```

4. **Update your `.env` file:**
   ```bash
   # Open .env and replace the DATABASE_URL line with:
   DATABASE_URL="your_neon_connection_string_here"
   ```

5. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

6. **Test signup again!**

---

### Option 2: Fix Local PostgreSQL

If you have PostgreSQL installed locally:

1. **Check if PostgreSQL is running:**
   ```bash
   brew services list | grep postgresql
   # or
   ps aux | grep postgres
   ```

2. **If not running, start it:**
   ```bash
   brew services start postgresql@14
   # or
   brew services start postgresql
   ```

3. **Create the database and user:**
   ```bash
   # Connect to PostgreSQL (use your actual postgres user)
   psql postgres
   
   # In PostgreSQL prompt:
   CREATE DATABASE mydb;
   CREATE USER johndoe WITH PASSWORD 'your_password_here';
   GRANT ALL PRIVILEGES ON DATABASE mydb TO johndoe;
   \q
   ```

4. **Update your `.env` file:**
   ```env
   DATABASE_URL="postgresql://johndoe:your_password_here@localhost:5432/mydb?schema=public"
   ```

5. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

---

### Option 3: Use Default PostgreSQL User

If you want to use the default `postgres` user:

1. **Update your `.env` file:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_POSTGRES_PASSWORD@localhost:5432/mydb?schema=public"
   ```
   (Replace `YOUR_POSTGRES_PASSWORD` with your actual PostgreSQL password)

2. **Create the database:**
   ```bash
   createdb mydb
   # or
   psql postgres -c "CREATE DATABASE mydb;"
   ```

3. **Run migrations:**
   ```bash
   npx prisma migrate dev --name init
   ```

---

## After Fixing Database Connection

1. **Test the connection:**
   ```bash
   node scripts/test-db-connection.js
   ```
   Should show: ✅ Successfully connected to database!

2. **Run migrations (if not done):**
   ```bash
   npx prisma migrate dev --name init
   ```

3. **Restart your dev server:**
   ```bash
   npm run dev
   ```

4. **Try signing up again at http://localhost:3000/signup**

---

## Still Having Issues?

Run this to see the exact error:
```bash
node scripts/test-db-connection.js
```

The error message will tell you what's wrong (authentication, database doesn't exist, connection refused, etc.)

