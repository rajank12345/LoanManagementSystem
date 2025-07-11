# Loan Management Application

A comprehensive loan management system built with React, TypeScript, and PostgreSQL (Neon). Perfect for small businesses and shopkeepers to manage their loan portfolios.

## 🚀 Live Demo

[View Live Demo](https://your-app-name.netlify.app)

## ✨ Features

- **Borrower Management**: Add, edit, and track borrower information
- **Loan Management**: Create and manage loans with simple interest calculations
- **Installment Tracking**: Record and monitor loan payments
- **Reports & Analytics**: Comprehensive reporting with search and filters
- **Real-time Editing**: Inline editing for quick updates
- **Database Persistence**: All data stored in PostgreSQL via Neon
- **Authentication**: Secure single-user login system
- **Password Protection**: Toggle visibility for sensitive financial data

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **ORM**: Drizzle ORM
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Deployment**: Netlify

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Neon PostgreSQL account

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/loan-management-app.git
cd loan-management-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
# Database Configuration
DATABASE_URL=postgresql://username:password@host/database?sslmode=require

# Authentication
VITE_ADMIN_USERNAME=your_username
VITE_ADMIN_PASSWORD=your_secure_password
```

### 4. Database Setup
```bash
# Generate database migrations
npm run db:generate

# Apply migrations to your database
npm run db:migrate

# (Optional) Open Drizzle Studio to view your database
npm run db:studio
```

### 5. Start Development Server
```bash
npm run dev
```

## 🚀 Deployment

### Deploy to Netlify

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Netlify**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub repository
   - Set build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`

3. **Environment Variables**
   In Netlify dashboard, go to Site Settings > Environment Variables and add:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `VITE_ADMIN_USERNAME`: Your admin username
   - `VITE_ADMIN_PASSWORD`: Your admin password

4. **Deploy**
   - Netlify will automatically build and deploy your site
   - Your app will be available at `https://your-app-name.netlify.app`

### Alternative: Manual Deployment
```bash
# Build for production
npm run build

# The built files will be in the `dist` directory
# Upload these files to your hosting provider
```

## 🔐 Authentication

The app uses a simple single-user authentication system:
- Username and password are set via environment variables
- Session management with localStorage
- Route protection for all authenticated pages
- Automatic logout on session expiry

## 📊 Database Schema

### Borrowers
- Personal information (name, contact, address)
- Reference and security details
- Notes and timestamps

### Loans
- Loan amount and interest rate
- Duration and status tracking
- Linked to borrowers
- Simple interest calculation: Principal + (Principal × Rate × Months / 100) - Total Paid

### Installments
- Payment tracking
- Linked to specific loans
- Payment dates and amounts

## 🎯 Key Features

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

### Financial Calculations
- Simple interest formula implementation
- Outstanding amount calculations
- Payment tracking and summaries

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the [Issues](https://github.com/yourusername/loan-management-app/issues) page
2. Create a new issue with detailed information
3. Contact the maintainer

---

**Note**: Make sure to replace `yourusername` and `your-app-name` with your actual GitHub username and Netlify app name throughout this README.