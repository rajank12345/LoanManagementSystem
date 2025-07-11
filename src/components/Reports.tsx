import React, { useState } from 'react';
import { FileText, TrendingUp, TrendingDown, Calendar, User, DollarSign, Percent, Search, X, Receipt, Edit2, Check, ArrowLeft, Save } from 'lucide-react';
import { useLoan } from '../context/LoanContext';

export default function Reports() {
  const { getLoansWithDetails, getDashboardStats, updateLoan } = useLoan();
  const [selectedBorrower, setSelectedBorrower] = useState('');
  const [dateRange, setDateRange] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'reports' | 'borrower-details'>('reports');
  const [selectedBorrowerDetails, setSelectedBorrowerDetails] = useState<any>(null);
  const [editingDuration, setEditingDuration] = useState<string | null>(null);
  const [newDuration, setNewDuration] = useState('');
  const [editingInterestRate, setEditingInterestRate] = useState<string | null>(null);
  const [newInterestRate, setNewInterestRate] = useState('');
  const [editingAmount, setEditingAmount] = useState<string | null>(null);
  const [newAmount, setNewAmount] = useState('');
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');
  
  const loansWithDetails = getLoansWithDetails();
  const stats = getDashboardStats();
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const filteredLoans = loansWithDetails.filter(loan => {
    if (selectedBorrower && loan.borrowerId !== selectedBorrower) return false;
    
    // Search functionality
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        loan.borrower.name.toLowerCase().includes(searchLower) ||
        loan.borrower.contact.includes(searchTerm) ||
        loan.borrower.address.toLowerCase().includes(searchLower) ||
        loan.amount.toString().includes(searchTerm) ||
        loan.interestRate.toString().includes(searchTerm) ||
        loan.status.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) return false;
    }
    
    // Status filter
    if (statusFilter !== 'all' && loan.status !== statusFilter) return false;
    
    if (dateRange !== 'all') {
      const loanDate = new Date(loan.startDate);
      const now = new Date();
      
      switch (dateRange) {
        case 'thisMonth':
          return loanDate.getMonth() === now.getMonth() && 
                 loanDate.getFullYear() === now.getFullYear();
        case 'lastMonth':
          const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
          return loanDate.getMonth() === lastMonth.getMonth() && 
                 loanDate.getFullYear() === lastMonth.getFullYear();
        case 'thisYear':
          return loanDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    }
    
    return true;
  });

  const borrowerOptions = Array.from(new Set(loansWithDetails.map(loan => loan.borrower)))
    .map(borrower => ({ id: borrower.id, name: borrower.name }));

  const generateReport = () => {
    const reportData = filteredLoans.map(loan => ({
      borrower: loan.borrower.name,
      amount: loan.amount,
      interestRate: loan.interestRate,
      startDate: loan.startDate.toLocaleDateString(),
      status: loan.status,
      totalPaid: loan.totalPaid,
      remainingBalance: loan.remainingBalance,
      monthlyInstallment: loan.monthlyInstallment
    }));

    const csvContent = [
      ['Borrower', 'Loan Amount', 'Interest Rate', 'Start Date', 'Status', 'Total Paid', 'Remaining Balance', 'Monthly Installment'],
      ...reportData.map(loan => [
        loan.borrower,
        loan.amount,
        loan.interestRate + '%',
        loan.startDate,
        loan.status,
        loan.totalPaid,
        loan.remainingBalance,
        loan.monthlyInstallment
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `loan_report_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleBorrowerClick = (borrower: any) => {
    const borrowerLoans = loansWithDetails.filter(loan => loan.borrowerId === borrower.id);
    const borrowerInstallments = borrowerLoans.flatMap(loan => 
      loan.installments.map(installment => ({
        ...installment,
        loanAmount: loan.amount,
        loanInterestRate: loan.interestRate,
        loanStartDate: loan.startDate
      }))
    ).sort((a, b) => new Date(b.paymentDate).getTime() - new Date(a.paymentDate).getTime());
    
    setSelectedBorrowerDetails({
      borrower,
      loans: borrowerLoans,
      installments: borrowerInstallments,
      totalLent: borrowerLoans.reduce((sum, loan) => sum + loan.amount, 0),
      totalPaid: borrowerLoans.reduce((sum, loan) => sum + loan.totalPaid, 0),
      totalOutstanding: borrowerLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0)
    });
    setViewMode('borrower-details');
  };

  const handleDurationEdit = (loanId: string, currentDuration: number) => {
    setEditingDuration(loanId);
    setNewDuration(currentDuration.toString());
  };

  const handleDurationSave = (loan: any) => {
    const updatedLoan = {
      ...loan,
      durationMonths: parseInt(newDuration)
    };
    updateLoan(updatedLoan);
    setEditingDuration(null);
    setNewDuration('');
  };

  const handleDurationCancel = () => {
    setEditingDuration(null);
    setNewDuration('');
    setEditingInterestRate(null);
    setNewInterestRate('');
    setEditingAmount(null);
    setNewAmount('');
    setEditingStatus(null);
    setNewStatus('');
  };

  const handleInterestRateEdit = (loanId: string, currentRate: number) => {
    setEditingInterestRate(loanId);
    setNewInterestRate(currentRate.toString());
  };

  const handleInterestRateSave = (loan: any) => {
    const updatedLoan = {
      ...loan,
      interestRate: parseFloat(newInterestRate)
    };
    updateLoan(updatedLoan);
    setEditingInterestRate(null);
    setNewInterestRate('');
  };

  const handleAmountEdit = (loanId: string, currentAmount: number) => {
    setEditingAmount(loanId);
    setNewAmount(currentAmount.toString());
  };

  const handleAmountSave = (loan: any) => {
    const updatedLoan = {
      ...loan,
      amount: parseFloat(newAmount)
    };
    updateLoan(updatedLoan);
    setEditingAmount(null);
    setNewAmount('');
  };

  const handleStatusEdit = (loanId: string, currentStatus: string) => {
    setEditingStatus(loanId);
    setNewStatus(currentStatus);
  };

  const handleStatusSave = (loan: any) => {
    const updatedLoan = {
      ...loan,
      status: newStatus as 'active' | 'closed' | 'defaulted'
    };
    updateLoan(updatedLoan);
    setEditingStatus(null);
    setNewStatus('');
  };

  if (viewMode === 'borrower-details' && selectedBorrowerDetails) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setViewMode('reports')}
              className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Reports</span>
            </button>
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedBorrowerDetails.borrower.name} - Loan Details
            </h2>
          </div>
        </div>

        {/* Borrower Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Loans</p>
                <p className="text-2xl font-bold text-gray-900">{selectedBorrowerDetails.loans.length}</p>
              </div>
              <div className="p-3 rounded-full bg-blue-50">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Lent</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedBorrowerDetails.totalLent)}</p>
              </div>
              <div className="p-3 rounded-full bg-green-50">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Paid</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedBorrowerDetails.totalPaid)}</p>
              </div>
              <div className="p-3 rounded-full bg-emerald-50">
                <Receipt className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Outstanding</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(selectedBorrowerDetails.totalOutstanding)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Loans List */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Loans</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedBorrowerDetails.loans.map((loan: any) => {
                  const totalAmount = loan.monthlyInstallment * loan.durationMonths;
                  const progress = totalAmount > 0 ? (loan.totalPaid / totalAmount) * 100 : 0;
                  
                  return (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingAmount === loan.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={newAmount}
                              onChange={(e) => setNewAmount(e.target.value)}
                              className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => handleAmountSave(loan)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleDurationCancel}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{formatCurrency(loan.amount)}</span>
                            <button
                              onClick={() => handleAmountEdit(loan.id, loan.amount)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingInterestRate === loan.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={newInterestRate}
                              onChange={(e) => setNewInterestRate(e.target.value)}
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="text-sm text-gray-500">%</span>
                            <button
                              onClick={() => handleInterestRateSave(loan)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleDurationCancel}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Percent className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{loan.interestRate}%</span>
                            <button
                              onClick={() => handleInterestRateEdit(loan.id, loan.interestRate)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingDuration === loan.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              value={newDuration}
                              onChange={(e) => setNewDuration(e.target.value)}
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="text-sm text-gray-500">months</span>
                            <button
                              onClick={() => handleDurationSave(loan)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleDurationCancel}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{loan.durationMonths} months</span>
                            <button
                              onClick={() => handleDurationEdit(loan.id, loan.durationMonths)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(loan.startDate).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingStatus === loan.id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="active">Active</option>
                              <option value="closed">Closed</option>
                              <option value="defaulted">Defaulted</option>
                            </select>
                            <button
                              onClick={() => handleStatusSave(loan)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleDurationCancel}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              loan.status === 'active' ? 'bg-green-100 text-green-800' :
                              loan.status === 'closed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {loan.status}
                            </span>
                            <button
                              onClick={() => handleStatusEdit(loan.id, loan.status)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Receipt className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{loan.installments.length}</span>
                          <span className="text-xs text-gray-500">payments</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Installment History */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Installment History ({selectedBorrowerDetails.installments.length} payments)
            </h3>
          </div>
          {selectedBorrowerDetails.installments.length === 0 ? (
            <div className="text-center py-12">
              <Receipt className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No payments recorded yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Payment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount Paid
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loan Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Interest Rate
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Loan Start Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {selectedBorrowerDetails.installments.map((installment: any) => (
                    <tr key={installment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-900">
                            {new Date(installment.paymentDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">
                          {formatCurrency(installment.amount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatCurrency(installment.loanAmount)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Percent className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">{installment.loanInterestRate}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {new Date(installment.loanStartDate).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports</h2>
        <button
          onClick={generateReport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <FileText className="h-4 w-4" />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Search & Filters</h3>
        
        {/* Search Bar */}
        <div className="mb-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by borrower name, contact, address, amount, interest rate, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              </button>
            )}
          </div>
        </div>
        
        {/* Filter Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Borrower
            </label>
            <select
              value={selectedBorrower}
              onChange={(e) => setSelectedBorrower(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Borrowers</option>
              {borrowerOptions.map((borrower) => (
                <option key={borrower.id} value={borrower.id}>
                  {borrower.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="closed">Closed</option>
              <option value="defaulted">Defaulted</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Time</option>
              <option value="thisMonth">This Month</option>
              <option value="lastMonth">Last Month</option>
              <option value="thisYear">This Year</option>
            </select>
          </div>
        </div>
        
        {/* Filter Summary and Clear */}
        {(searchTerm || selectedBorrower || statusFilter !== 'all' || dateRange !== 'all') && (
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600 pt-4 border-t border-gray-200">
            <div className="flex flex-wrap gap-2">
              <span>
                Showing {filteredLoans.length} of {loansWithDetails.length} loans
              </span>
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                  Search: "{searchTerm}"
                </span>
              )}
              {selectedBorrower && (
                <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                  Borrower: {borrowerOptions.find(b => b.id === selectedBorrower)?.name}
                </span>
              )}
              {statusFilter !== 'all' && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                  Status: {statusFilter}
                </span>
              )}
              {dateRange !== 'all' && (
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full text-xs">
                  Period: {dateRange === 'thisMonth' ? 'This Month' : 
                          dateRange === 'lastMonth' ? 'Last Month' : 
                          dateRange === 'thisYear' ? 'This Year' : dateRange}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedBorrower('');
                setStatusFilter('all');
                setDateRange('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Loans</p>
              <p className="text-2xl font-bold text-gray-900">{filteredLoans.length}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-50">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Lent</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(filteredLoans.reduce((sum, loan) => sum + loan.amount, 0))}
              </p>
            </div>
            <div className="p-3 rounded-full bg-green-50">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Collected</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(filteredLoans.reduce((sum, loan) => sum + loan.totalPaid, 0))}
              </p>
            </div>
            <div className="p-3 rounded-full bg-emerald-50">
              <TrendingDown className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Outstanding</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(filteredLoans.reduce((sum, loan) => sum + loan.remainingBalance, 0))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Report */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Detailed Loan Report</h3>
        </div>
        {filteredLoans.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No loans found matching the selected criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Borrower
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Loan Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Paid
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outstanding
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Installments
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Progress
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.map((loan) => {
                  const totalAmount = loan.monthlyInstallment * loan.durationMonths;
                  const progress = totalAmount > 0 ? (loan.totalPaid / totalAmount) * 100 : 0;
                  
                  return (
                    <tr key={loan.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <button
                            onClick={() => handleBorrowerClick(loan.borrower)}
                            className="flex items-center hover:bg-blue-50 rounded-lg p-1 transition-colors"
                          >
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-blue-600" />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-blue-600 hover:text-blue-800">{loan.borrower.name}</div>
                              <div className="text-sm text-gray-500">{loan.borrower.contact}</div>
                            </div>
                          </button>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingAmount === loan.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={newAmount}
                              onChange={(e) => setNewAmount(e.target.value)}
                              className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                              onClick={() => handleAmountSave(loan)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleDurationCancel}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-gray-900">{formatCurrency(loan.amount)}</span>
                            <button
                              onClick={() => handleAmountEdit(loan.id, loan.amount)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingInterestRate === loan.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="0"
                              step="0.01"
                              value={newInterestRate}
                              onChange={(e) => setNewInterestRate(e.target.value)}
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="text-sm text-gray-500">%</span>
                            <button
                              onClick={() => handleInterestRateSave(loan)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleDurationCancel}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Percent className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{loan.interestRate}%</span>
                            <button
                              onClick={() => handleInterestRateEdit(loan.id, loan.interestRate)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {new Date(loan.startDate).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingStatus === loan.id ? (
                          <div className="flex items-center space-x-2">
                            <select
                              value={newStatus}
                              onChange={(e) => setNewStatus(e.target.value)}
                              className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                              <option value="active">Active</option>
                              <option value="closed">Closed</option>
                              <option value="defaulted">Defaulted</option>
                            </select>
                            <button
                              onClick={() => handleStatusSave(loan)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleDurationCancel}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              loan.status === 'active' ? 'bg-green-100 text-green-800' :
                              loan.status === 'closed' ? 'bg-blue-100 text-blue-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {loan.status}
                            </span>
                            <button
                              onClick={() => handleStatusEdit(loan.id, loan.status)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-green-600">{formatCurrency(loan.totalPaid)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-red-600">{formatCurrency(loan.remainingBalance)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {editingDuration === loan.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              min="1"
                              value={newDuration}
                              onChange={(e) => setNewDuration(e.target.value)}
                              className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <span className="text-sm text-gray-500">months</span>
                            <button
                              onClick={() => handleDurationSave(loan)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={handleDurationCancel}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-900">{loan.durationMonths} months</span>
                            <button
                              onClick={() => handleDurationEdit(loan.id, loan.durationMonths)}
                              className="text-blue-600 hover:text-blue-800 p-1"
                            >
                              <Edit2 className="h-3 w-3" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <Receipt className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{loan.installments.length}</span>
                          <span className="text-xs text-gray-500">payments</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                          />
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{Math.round(progress)}%</div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}