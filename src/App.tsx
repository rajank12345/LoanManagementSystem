import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import Login from './components/Login';
import { LoanProvider } from './context/LoanContext';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BorrowerList from './components/BorrowerList';
import LoanList from './components/LoanList';
import InstallmentList from './components/InstallmentList';
import Reports from './components/Reports';
import PrivateRoute from './components/PrivateRoute';
import { LogOut } from 'lucide-react';

function App() {
  const { isAuthenticated, isLoading, login, logout } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <LoanProvider>
      <Routes>
        <Route path="/login" element={<Login onLogin={login} />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Layout
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                onLogout={logout}
              >
                {(() => {
                  switch (currentPage) {
                    case 'dashboard':
                      return <Dashboard />;
                    case 'borrowers':
                      return <BorrowerList />;
                    case 'loans':
                      return <LoanList />;
                    case 'installments':
                      return <InstallmentList />;
                    case 'reports':
                      return <Reports />;
                    default:
                      return <Dashboard />;
                  }
                })()}
              </Layout>
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </LoanProvider>
  );
}

export default App;