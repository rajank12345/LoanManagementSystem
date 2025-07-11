import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const loginTime = localStorage.getItem('loginTime');
  let sessionValid = false;

  if (isAuthenticated && loginTime) {
    const loginDate = new Date(loginTime);
    const now = new Date();
    const hoursDiff = (now.getTime() - loginDate.getTime()) / (1000 * 60 * 60);
    sessionValid = hoursDiff < 24;
  }

  // Debug log
  console.log('PrivateRoute:', { isAuthenticated, loginTime, sessionValid });

  if (!sessionValid) {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('loginTime');
    return <Navigate to="/login" replace />;
  }

  return children;
} 