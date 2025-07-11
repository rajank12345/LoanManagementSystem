import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CreditCard, Calendar, Percent, User, Search, X, Check, Save } from 'lucide-react';
import { useLoan } from '../context/LoanContext';
import { Loan } from '../types';

export default function LoanList() {
  const { state, addLoan, updateLoan, deleteLoan, getLoansWithDetails } = useLoan();
  const [showForm, setShowForm] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Loan | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingField, setEditingField] = useState<{loanId: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');
  const [formData, setFormData] = useState({
    borrowerId: '',
    amount: '',
    interestRate: '',
    startDate: '',
    durationMonths: '',
    status: 'active' as 'active' | 'closed' | 'defaulted'
  });

  const loansWithDetails = getLoansWithDetails();

  // Filter loans based on search term and status
  const filteredLoans = loansWithDetails.filter(loan => {
    const matchesSearch = searchTerm === '' || 
      loan.borrower.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      loan.borrower.contact.includes(searchTerm) ||
      loan.amount.toString().includes(searchTerm) ||
      loan.interestRate.toString().includes(searchTerm);
    
    const matchesStatus = statusFilter === 'all' || loan.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const loanData = {
      borrowerId: formData.borrowerId,
      amount: parseFloat(formData.amount),
      interestRate: parseFloat(formData.interestRate),
      startDate: new Date(formData.startDate),
      durationMonths: parseInt(formData.durationMonths),
      status: formData.status
    };

    if (editingLoan) {
      updateLoan({
        ...editingLoan,
        ...loanData
      });
    } else {
      addLoan(loanData);
    }
    setFormData({
      borrowerId: '',
      amount: '',
      interestRate: '',
      startDate: '',
      durationMonths: '',
      status: 'active'
    });
    setShowForm(false);
    setEditingLoan(null);
  };

  const handleEdit = (loan: Loan) => {
    setEditingLoan(loan);
    setFormData({
      borrowerId: loan.borrowerId,
      amount: loan.amount.toString(),
      interestRate: loan.interestRate.toString(),
      startDate: loan.startDate.toISOString().split('T')[0],
      durationMonths: loan.durationMonths.toString(),
      status: loan.status
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this loan?')) {
      deleteLoan(id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-blue-100 text-blue-800';
      case 'defaulted': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleInlineEdit = (loanId: string, field: string, currentValue: any) => {
    setEditingField({ loanId, field });
    setEditValue(currentValue.toString());
  };

  const handleInlineSave = (loan: Loan) => {
    if (!editingField) return;
    
    let updatedLoan = { ...loan };
    
    switch (editingField.field) {
      case 'amount':
        updatedLoan.amount = parseFloat(editValue);
        break;
      case 'interestRate':
        updatedLoan.interestRate = parseFloat(editValue);
        break;
      case 'durationMonths':
        updatedLoan.durationMonths = parseInt(editValue);
        break;
      case 'status':
        updatedLoan.status = editValue as 'active' | 'closed' | 'defaulted';
        break;
    }
    
    updateLoan(updatedLoan);
    setEditingField(null);
    setEditValue('');
  };

  const handleInlineCancel = () => {
    setEditingField(null);
    setEditValue('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Loans</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Loan</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by borrower name, contact, amount, or interest rate..."
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
          <div className="md:w-48">
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
        </div>
        {(searchTerm || statusFilter !== 'all') && (
          <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredLoans.length} of {loansWithDetails.length} loans
              {searchTerm && ` matching "${searchTerm}"`}
              {statusFilter !== 'all' && ` with status "${statusFilter}"`}
            </span>
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
              }}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingLoan ? 'Edit Loan' : 'Add New Loan'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Borrower *
              </label>
              <select
                required
                value={formData.borrowerId}
                onChange={(e) => setFormData({ ...formData, borrowerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select borrower</option>
                {state.borrowers.map((borrower) => (
                  <option key={borrower.id} value={borrower.id}>
                    {borrower.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loan Amount *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter amount"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Monthly Interest Rate (%) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter interest rate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (months) *
              </label>
              <input
                type="number"
                required
                min="1"
                value={formData.durationMonths}
                onChange={(e) => setFormData({ ...formData, durationMonths: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter duration in months"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status *
              </label>
              <select
                required
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'closed' | 'defaulted' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="defaulted">Defaulted</option>
              </select>
            </div>
            <div className="md:col-span-2 flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingLoan ? 'Update' : 'Add'} Loan
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingLoan(null);
                  setFormData({
                    borrowerId: '',
                    amount: '',
                    interestRate: '',
                    startDate: '',
                    durationMonths: '',
                    status: 'active'
                  });
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Loan List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {filteredLoans.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">
              {loansWithDetails.length === 0 ? 'No loans added yet' : 'No loans match your search criteria'}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {loansWithDetails.length === 0 ? 'Click "Add Loan" to get started' : 'Try adjusting your search or filters'}
            </p>
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
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interest Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Outstanding
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{loan.borrower.name}</div>
                          <div className="text-sm text-gray-500">{loan.borrower.contact}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingField?.loanId === loan.id && editingField?.field === 'amount' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-24 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleInlineSave(loan)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleInlineCancel}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 group">
                          <span className="text-sm font-medium text-gray-900">{formatCurrency(loan.amount)}</span>
                          <button
                            onClick={() => handleInlineEdit(loan.id, 'amount', loan.amount)}
                            className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 p-1 transition-opacity"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingField?.loanId === loan.id && editingField?.field === 'interestRate' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <span className="text-sm text-gray-500">%</span>
                          <button
                            onClick={() => handleInlineSave(loan)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleInlineCancel}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 group">
                          <Percent className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{loan.interestRate}%</span>
                          <button
                            onClick={() => handleInlineEdit(loan.id, 'interestRate', loan.interestRate)}
                            className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 p-1 transition-opacity"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingField?.loanId === loan.id && editingField?.field === 'durationMonths' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="1"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-16 px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <span className="text-sm text-gray-500">months</span>
                          <button
                            onClick={() => handleInlineSave(loan)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleInlineCancel}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 group">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{loan.durationMonths} months</span>
                          <button
                            onClick={() => handleInlineEdit(loan.id, 'durationMonths', loan.durationMonths)}
                            className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 p-1 transition-opacity"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingField?.loanId === loan.id && editingField?.field === 'status' ? (
                        <div className="flex items-center space-x-2">
                          <select
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="active">Active</option>
                            <option value="closed">Closed</option>
                            <option value="defaulted">Defaulted</option>
                          </select>
                          <button
                            onClick={() => handleInlineSave(loan)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={handleInlineCancel}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 group">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(loan.status)}`}>
                            {loan.status}
                          </span>
                          <button
                            onClick={() => handleInlineEdit(loan.id, 'status', loan.status)}
                            className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 p-1 transition-opacity"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{formatCurrency(loan.remainingBalance)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(loan)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(loan.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
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