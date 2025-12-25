# RBAC Configurator

A full-stack web application for managing Role-Based Access Control (RBAC) with a modern tech stack. This internal tool allows administrators to visually create, manage, and link permissions and roles.

## What is RBAC? (For Kids)

Imagine you have a big toy box with different toys. RBAC is like giving each friend a special badge that says what toys they can play with. Some friends (like the "Teacher" role) can use all toys, while others (like the "Student" role) can only use certain toys. This way, everyone knows what they're allowed to do, and the toys stay organized and safe!

## Features

- ✅ **User Authentication**: Custom login/signup system with password hashing and JWT-based sessions
- ✅ **Permission Management**: Full CRUD operations for permissions
- ✅ **Role Management**: Full CRUD operations for roles
- ✅ **Role-Permission Linking**: User-friendly interface to attach permissions to roles and view associations
- ⭐ **Natural Language Configuration**: Use plain English commands to manage RBAC settings (Bonus Feature)

## Tech Stack

- **Frontend**: Next.js 15 with TypeScript
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT + bcrypt
- **UI Library**: Shadcn UI components
- **Styling**: Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ASSIGNMENT
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/rbac_db?schema=public"
JWT_SECRET="your-secret-key-change-this-in-production"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

Replace the `DATABASE_URL` with your PostgreSQL connection string.

### 4. Set Up the Database

```bash
# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 6. Create Your First Account

Navigate to `/signup` and create an account to get started.

## Project Structure

```
ASSIGNMENT/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── permissions/   # Permission CRUD endpoints
│   │   ├── roles/         # Role CRUD endpoints
│   │   └── nl-command/    # Natural language command parser
│   ├── dashboard/         # Main dashboard page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── layout.tsx         # Root layout
├── components/
│   └── ui/                # Shadcn UI components
├── lib/
│   ├── auth.ts           # Authentication utilities
│   ├── prisma.ts         # Prisma client instance
│   └── utils.ts          # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
└── middleware.ts         # Auth middleware
```

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create a new user account
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Permissions
- `GET /api/permissions` - Get all permissions
- `POST /api/permissions` - Create a new permission
- `GET /api/permissions/[id]` - Get a single permission
- `PUT /api/permissions/[id]` - Update a permission
- `DELETE /api/permissions/[id]` - Delete a permission
- `GET /api/permissions/[id]/roles` - Get roles associated with a permission

### Roles
- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create a new role
- `GET /api/roles/[id]` - Get a single role
- `PUT /api/roles/[id]` - Update a role
- `DELETE /api/roles/[id]` - Delete a role
- `GET /api/roles/[id]/permissions` - Get permissions for a role
- `PUT /api/roles/[id]/permissions` - Update permissions for a role

### Natural Language
- `POST /api/nl-command` - Execute a natural language command

## Natural Language Commands

The application supports natural language commands for managing RBAC. Examples:

- "Create a new permission called 'edit articles'"
- "Create a new role called 'Content Editor'"
- "Give the role 'Content Editor' the permission to 'edit articles'"
- "Assign permission 'delete users' to role 'Administrator'"
- "Remove permission 'edit articles' from role 'Content Editor'"
- "Delete permission 'edit articles'"
- "Delete role 'Content Editor'"

## Database Schema

The application uses the following database schema:

- **users**: User accounts with email and hashed passwords
- **permissions**: Individual permissions (e.g., `can_edit_articles`)
- **roles**: User roles (e.g., `Administrator`, `Content Editor`)
- **role_permissions**: Junction table linking roles to permissions
- **user_roles**: Junction table linking users to roles

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Environment Variables for Production

Make sure to set:
- `DATABASE_URL` - Your production PostgreSQL connection string
- `JWT_SECRET` - A strong, random secret key
- `NEXT_PUBLIC_APP_URL` - Your production URL

## Test Credentials

After setting up the application, create an account using the signup page. You can use:
- Email: `admin@example.com`
- Password: `password123` (or any password you choose)

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run database migrations
npx prisma migrate dev

# Open Prisma Studio (database GUI)
npx prisma studio
```

## License

This project is created for assignment purposes.

## Contact

For questions about this assignment, contact: +91-7700000766 (Akshay Gaur)

