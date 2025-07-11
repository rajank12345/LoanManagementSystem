import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Users, CreditCard, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { useLoan } from '../context/LoanContext';

const STAT_PASSWORD = 'Raghav_@123';

export default function Dashboard() {
  const { getDashboardStats, getLoansWithDetails } = useLoan();
  const stats = getDashboardStats();
  const recentLoans = getLoansWithDetails().slice(-5);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Toggle state and error for each stat
  const [showLent, setShowLent] = useState(false);
  const [showReceived, setShowReceived] = useState(false);
  const [showActive, setShowActive] = useState(false);
  const [showOutstanding, setShowOutstanding] = useState(false);
  const [error, setError] = useState<{ [key: string]: string }>({});

  // Password prompt for each stat
  const handleToggle = (key: string, setShow: (v: boolean) => void, current: boolean) => {
    if (!current) {
      const pwd = window.prompt('Enter password to view this value:');
      if (pwd === STAT_PASSWORD) {
        setShow(true);
        setError(e => ({ ...e, [key]: '' }));
      } else {
        setError(e => ({ ...e, [key]: 'Incorrect password.' }));
      }
    } else {
      setShow(false);
      setError(e => ({ ...e, [key]: '' }));
    }
  };

  const statCards = [
    {
      key: 'lent',
      title: 'Total Lent',
      value: formatCurrency(stats.totalLent),
      icon: TrendingUp,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      show: showLent,
      setShow: setShowLent
    },
    {
      key: 'received',
      title: 'Total Received',
      value: formatCurrency(stats.totalReceived),
      icon: TrendingDown,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      show: showReceived,
      setShow: setShowReceived
    },
    {
      key: 'active',
      title: 'Active Loans',
      value: stats.activeLoans.toString(),
      icon: CreditCard,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      show: showActive,
      setShow: setShowActive
    },
    {
      key: 'outstanding',
      title: 'Outstanding Balance',
      value: formatCurrency(stats.outstandingBalance),
      icon: AlertCircle,
      color: 'text-red-600',
      bg: 'bg-red-50',
      show: showOutstanding,
      setShow: setShowOutstanding
    }
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 flex items-center">
                  {stat.title}
                  <button
                    className="ml-2 text-gray-400 hover:text-gray-700 focus:outline-none"
                    onClick={() => handleToggle(stat.key, stat.setShow, stat.show)}
                    title={stat.show ? 'Hide' : 'Show'}
                  >
                    {stat.show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </p>
                {error[stat.key] && (
                  <p className="text-xs text-red-500 mt-1">{error[stat.key]}</p>
                )}
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stat.show ? stat.value : '•••••'}
                </p>
              </div>
              <div className={`p-3 rounded-full ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Loans */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Loans</h3>
          <div className="space-y-4">
            {recentLoans.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No loans yet</p>
            ) : (
              recentLoans.map((loan) => (
                <div key={loan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      loan.status === 'active' ? 'bg-green-100' : 
                      loan.status === 'closed' ? 'bg-blue-100' : 'bg-red-100'
                    }`}>
                      {loan.status === 'active' ? (
                        <AlertCircle className="h-4 w-4 text-green-600" />
                      ) : loan.status === 'closed' ? (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{loan.borrower.name}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(loan.amount)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{loan.interestRate}%</p>
                    <p className="text-xs text-gray-500 capitalize">{loan.status}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-medium text-gray-900">Closed Loans</span>
              </div>
              <span className="text-lg font-bold text-green-600">{stats.closedLoans}</span>
            </div>
            
            <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <CreditCard className="h-5 w-5 text-amber-600" />
                <span className="font-medium text-gray-900">Active Loans</span>
              </div>
              <span className="text-lg font-bold text-amber-600">{stats.activeLoans}</span>
            </div>

            <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-gray-900">Collection Rate</span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {stats.totalLent > 0 ? Math.round((stats.totalReceived / stats.totalLent) * 100) : 0}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}