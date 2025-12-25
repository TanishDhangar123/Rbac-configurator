#!/bin/bash
echo "=========================================="
echo "Quick Database Setup Helper"
echo "=========================================="
echo ""
echo "Choose an option:"
echo "1. I'll use Neon (cloud database) - RECOMMENDED"
echo "2. I have PostgreSQL installed locally"
echo "3. Show me my current DATABASE_URL (masked)"
echo ""
read -p "Enter choice (1-3): " choice

case $choice in
  1)
    echo ""
    echo "📝 Steps:"
    echo "1. Go to https://neon.tech and sign up"
    echo "2. Create a new project"
    echo "3. Copy the connection string"
    echo "4. Update your .env file with:"
    echo "   DATABASE_URL=\"your_neon_connection_string\""
    echo ""
    echo "Then run: npx prisma migrate dev --name init"
    ;;
  2)
    echo ""
    echo "To fix your local PostgreSQL:"
    echo ""
    echo "1. Create database and user:"
    echo "   psql postgres"
    echo "   CREATE DATABASE mydb;"
    echo "   CREATE USER johndoe WITH PASSWORD 'yourpassword';"
    echo "   GRANT ALL PRIVILEGES ON DATABASE mydb TO johndoe;"
    echo ""
    echo "2. Update .env with correct password"
    echo "3. Run: npx prisma migrate dev --name init"
    ;;
  3)
    echo ""
    echo "Current DATABASE_URL (password hidden):"
    grep DATABASE_URL .env 2>/dev/null | sed 's/:[^:@]*@/:***@/g' || echo "Not found in .env"
    ;;
  *)
    echo "Invalid choice"
    ;;
esac
