# Shopkeeper Loan Management Application

A comprehensive loan management system built with React, TypeScript, and PostgreSQL (Neon).

## Features

- **Borrower Management**: Add, edit, and track borrower information
- **Loan Management**: Create and manage loans with interest calculations
- **Installment Tracking**: Record and monitor loan payments
- **Reports & Analytics**: Comprehensive reporting with search and filters
- **Real-time Editing**: Inline editing for quick updates
- **Database Persistence**: All data stored in PostgreSQL via Neon

## Authentication

- The app is protected by a login screen.
- Only one user (admin) can access the app.
- The admin username and password are set via environment variables:
  - `VITE_ADMIN_USERNAME`
  - `VITE_ADMIN_PASSWORD`
- Example `.env` file:
  ```
  VITE_ADMIN_USERNAME=rajank
  VITE_ADMIN_PASSWORD=Raghav_@123
  ```
- Credentials are not hardcoded in the codebase.

## Database Setup

### 1. Create Neon Account
1. Go to [https://neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project

### 2. Configure Database Connection
1. Copy your connection string from the Neon dashboard
2. Update the `.env` file with your database URL:
   ```
   DATABASE_URL=postgresql://username:password@host/database?sslmode=require
   ```

### 3. Initialize Database
```bash
# Generate database migrations
npm run db:generate

# Apply migrations to your database
npm run db:migrate

# (Optional) Open Drizzle Studio to view your database
npm run db:studio
```

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Database Schema

### Borrowers
- Personal information (name, contact, address)
- Reference and security details
- Notes and timestamps

### Loans
- Loan amount and interest rate
- Duration and status tracking
- Linked to borrowers

### Installments
- Payment tracking
- Linked to specific loans
- Payment dates and amounts

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Icons**: Lucide React
- **Build Tool**: Vite

## Key Features

### Real-time Data Persistence
- All changes are automatically saved to the database
- No data loss between sessions
- Proper error handling and loading states

### Inline Editing
- Click any field to edit in place
- Instant save/cancel options
- Smooth user experience

### Comprehensive Reporting
- Advanced search and filtering
- Export functionality
- Detailed borrower views

### Responsive Design
- Works on all device sizes
- Mobile-friendly interface
- Clean, professional appearance