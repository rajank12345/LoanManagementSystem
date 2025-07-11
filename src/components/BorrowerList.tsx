import React, { useState } from 'react';
import { Plus, Edit2, Trash2, User, Phone, UserCheck, MapPin, FileText, Check, X } from 'lucide-react';
import { useLoan } from '../context/LoanContext';
import { Borrower } from '../types';

export default function BorrowerList() {
  const { state, addBorrower, updateBorrower, deleteBorrower } = useLoan();
  const [showForm, setShowForm] = useState(false);
  const [editingBorrower, setEditingBorrower] = useState<Borrower | null>(null);
  const [editingField, setEditingField] = useState<{borrowerId: string, field: string} | null>(null);
  const [editValue, setEditValue] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    address: '',
    reference: '',
    security: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBorrower) {
      updateBorrower({
        ...editingBorrower,
        ...formData
      });
    } else {
      addBorrower(formData);
    }
    setFormData({ name: '', contact: '', address: '', reference: '', security: '', notes: '' });
    setShowForm(false);
    setEditingBorrower(null);
  };

  const handleEdit = (borrower: Borrower) => {
    setEditingBorrower(borrower);
    setFormData({
      name: borrower.name,
      contact: borrower.contact,
      address: borrower.address,
      reference: borrower.reference,
      security: borrower.security,
      notes: borrower.notes
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this borrower?')) {
      deleteBorrower(id);
    }
  };

  const handleInlineEdit = (borrowerId: string, field: string, currentValue: string) => {
    setEditingField({ borrowerId, field });
    setEditValue(currentValue);
  };

  const handleInlineSave = (borrower: Borrower) => {
    if (!editingField) return;
    
    let updatedBorrower = { ...borrower };
    
    switch (editingField.field) {
      case 'name':
        updatedBorrower.name = editValue;
        break;
      case 'contact':
        updatedBorrower.contact = editValue;
        break;
      case 'address':
        updatedBorrower.address = editValue;
        break;
      case 'reference':
        updatedBorrower.reference = editValue;
        break;
      case 'security':
        updatedBorrower.security = editValue;
        break;
      case 'notes':
        updatedBorrower.notes = editValue;
        break;
    }
    
    updateBorrower(updatedBorrower);
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
        <h2 className="text-2xl font-bold text-gray-900">Borrowers</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Add Borrower</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingBorrower ? 'Edit Borrower' : 'Add New Borrower'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter contact number"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                required
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Enter complete address"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference
                </label>
                <input
                  type="text"
                  value={formData.reference}
                  onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Who referred them?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Security Provided
                </label>
                <input
                  type="text"
                  value={formData.security}
                  onChange={(e) => setFormData({ ...formData, security: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Collateral or guarantee"
                />
              </div>
            </div>
            
           <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
               Notes
             </label>
             <textarea
               rows={3}
               value={formData.notes}
               onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
               className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
               placeholder="Additional notes about the borrower (optional)"
             />
           </div>
           
            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editingBorrower ? 'Update' : 'Add'} Borrower
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBorrower(null);
                  setFormData({ name: '', contact: '', address: '', reference: '', security: '', notes: '' });
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Borrower List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {state.borrowers.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No borrowers added yet</p>
            <p className="text-sm text-gray-400 mt-1">Click "Add Borrower" to get started</p>
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
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Security
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {state.borrowers.map((borrower) => (
                  <tr key={borrower.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="ml-4">
                          {editingField?.borrowerId === borrower.id && editingField?.field === 'name' ? (
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                              <button
                                onClick={() => handleInlineSave(borrower)}
                                className="text-green-600 hover:text-green-800 p-1"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                              <button
                                onClick={handleInlineCancel}
                                className="text-red-600 hover:text-red-800 p-1"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2 group">
                              <span className="text-sm font-medium text-gray-900">{borrower.name}</span>
                              <button
                                onClick={() => handleInlineEdit(borrower.id, 'name', borrower.name)}
                                className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 p-1 transition-opacity"
                              >
                                <Edit2 className="h-3 w-3" />
                              </button>
                            </div>
                          )}
                          <div className="text-sm text-gray-500">
                            Added {new Date(borrower.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingField?.borrowerId === borrower.id && editingField?.field === 'contact' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="tel"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleInlineSave(borrower)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                          <button
                            onClick={handleInlineCancel}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 group">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{borrower.contact}</span>
                          <button
                            onClick={() => handleInlineEdit(borrower.id, 'contact', borrower.contact)}
                            className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 p-1 transition-opacity"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingField?.borrowerId === borrower.id && editingField?.field === 'address' ? (
                        <div className="flex items-center space-x-2">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={2}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          />
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => handleInlineSave(borrower)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={handleInlineCancel}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start space-x-2 group">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900 break-words max-w-xs">{borrower.address}</span>
                          <button
                            onClick={() => handleInlineEdit(borrower.id, 'address', borrower.address)}
                            className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 p-1 transition-opacity"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingField?.borrowerId === borrower.id && editingField?.field === 'reference' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleInlineSave(borrower)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                          <button
                            onClick={handleInlineCancel}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 group">
                          <UserCheck className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-900">{borrower.reference || 'N/A'}</span>
                          <button
                            onClick={() => handleInlineEdit(borrower.id, 'reference', borrower.reference)}
                            className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 p-1 transition-opacity"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingField?.borrowerId === borrower.id && editingField?.field === 'security' ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleInlineSave(borrower)}
                            className="text-green-600 hover:text-green-800 p-1"
                          >
                            <Check className="h-3 w-3" />
                          </button>
                          <button
                            onClick={handleInlineCancel}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-2 group">
                          <span className="text-sm text-gray-900">{borrower.security || 'N/A'}</span>
                          <button
                            onClick={() => handleInlineEdit(borrower.id, 'security', borrower.security)}
                            className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 p-1 transition-opacity"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingField?.borrowerId === borrower.id && editingField?.field === 'notes' ? (
                        <div className="flex items-center space-x-2">
                          <textarea
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            rows={2}
                            className="px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          />
                          <div className="flex flex-col space-y-1">
                            <button
                              onClick={() => handleInlineSave(borrower)}
                              className="text-green-600 hover:text-green-800 p-1"
                            >
                              <Check className="h-3 w-3" />
                            </button>
                            <button
                              onClick={handleInlineCancel}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start space-x-2 group">
                          <FileText className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-900 break-words max-w-xs">
                            {borrower.notes || 'No notes'}
                          </span>
                          <button
                            onClick={() => handleInlineEdit(borrower.id, 'notes', borrower.notes)}
                            className="opacity-0 group-hover:opacity-100 text-blue-600 hover:text-blue-800 p-1 transition-opacity"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(borrower)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(borrower.id)}
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