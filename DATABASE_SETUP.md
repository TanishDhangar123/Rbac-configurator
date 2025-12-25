# Database Setup Guide

## Option 1: Local PostgreSQL Setup

### 1. Install PostgreSQL (if not already installed)

**macOS (using Homebrew):**
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Or download from:** https://www.postgresql.org/download/

### 2. Create Database and User

```bash
# Connect to PostgreSQL
psql postgres

# In PostgreSQL prompt, run:
CREATE DATABASE rbac_db;
CREATE USER rbac_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE rbac_db TO rbac_user;
\q
```

### 3. Update .env file

Update your `.env` file with:

```env
DATABASE_URL="postgresql://rbac_user:your_secure_password@localhost:5432/rbac_db?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 4. Run Migrations

```bash
npx prisma migrate dev --name init
```

---

## Option 2: Cloud Database (Recommended for Quick Setup)

### Using Neon (Free PostgreSQL)

1. Go to https://neon.tech
2. Sign up for free account
3. Create a new project
4. Copy the connection string
5. Update your `.env` file:

```env
DATABASE_URL="postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require"
JWT_SECRET="your-secret-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Using Supabase (Free PostgreSQL)

1. Go to https://supabase.com
2. Sign up and create a new project
3. Go to Settings > Database
4. Copy the connection string (use the "Connection string" under "Connection pooling")
5. Update your `.env` file

### Using Railway (Free PostgreSQL)

1. Go to https://railway.app
2. Sign up and create a new project
3. Add a PostgreSQL service
4. Copy the connection string from the service variables
5. Update your `.env` file

---

## Option 3: Using Default PostgreSQL User

If you want to use the default `postgres` user:

```env
DATABASE_URL="postgresql://postgres:your_postgres_password@localhost:5432/rbac_db?schema=public"
```

**Note:** Replace `your_postgres_password` with your actual PostgreSQL password.

---

## Verify Connection

After updating `.env`, test the connection:

```bash
npx prisma db pull
```

If successful, run migrations:

```bash
npx prisma migrate dev --name init
```

---

## Troubleshooting

### Error: "Authentication failed"
- Check that PostgreSQL is running: `brew services list` (macOS) or check service status
- Verify username and password in DATABASE_URL
- Make sure the database exists

### Error: "Database does not exist"
- Create the database: `CREATE DATABASE rbac_db;`

### Error: "Connection refused"
- Make sure PostgreSQL is running
- Check the port (default is 5432)
- Verify the host is correct (localhost vs 127.0.0.1)

