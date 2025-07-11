// API client for communicating with serverless functions

const API_BASE = '/.netlify/functions';

async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

// Borrower API functions
export async function getAllBorrowers() {
  return apiRequest('/borrowers');
}

export async function createBorrower(data: any) {
  return apiRequest('/borrowers', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateBorrower(id: string, data: any) {
  return apiRequest('/borrowers', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  });
}

export async function deleteBorrower(id: string) {
  return apiRequest(`/borrowers?id=${id}`, {
    method: 'DELETE',
  });
}

// Loan API functions
export async function getAllLoans() {
  return apiRequest('/loans');
}

export async function createLoan(data: any) {
  return apiRequest('/loans', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateLoan(id: string, data: any) {
  return apiRequest('/loans', {
    method: 'PUT',
    body: JSON.stringify({ id, ...data }),
  });
}

export async function deleteLoan(id: string) {
  return apiRequest(`/loans?id=${id}`, {
    method: 'DELETE',
  });
}

// Installment API functions
export async function getAllInstallments() {
  return apiRequest('/installments');
}

export async function createInstallment(data: any) {
  return apiRequest('/installments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteInstallment(id: string) {
  return apiRequest(`/installments?id=${id}`, {
    method: 'DELETE',
  });
}