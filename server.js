const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8888;

app.use(cors());
app.use(express.json());

// Mock data
const mockBorrowers = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '123-456-7890' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '098-765-4321' }
];

const mockLoans = [
  { 
    id: '1', 
    borrowerId: '1', 
    amount: 10000, 
    interestRate: 5.5, 
    term: 12, 
    status: 'active',
    startDate: '2024-01-01'
  }
];

const mockInstallments = [
  {
    id: '1',
    loanId: '1',
    amount: 879.16,
    dueDate: '2024-02-01',
    status: 'paid',
    paidDate: '2024-02-01'
  }
];

// API endpoints
app.get('/.netlify/functions/borrowers', (req, res) => {
  res.json(mockBorrowers);
});

app.post('/.netlify/functions/borrowers', (req, res) => {
  const newBorrower = { id: Date.now().toString(), ...req.body };
  mockBorrowers.push(newBorrower);
  res.json(newBorrower);
});

app.get('/.netlify/functions/loans', (req, res) => {
  res.json(mockLoans);
});

app.post('/.netlify/functions/loans', (req, res) => {
  const newLoan = { id: Date.now().toString(), ...req.body };
  mockLoans.push(newLoan);
  res.json(newLoan);
});

app.get('/.netlify/functions/installments', (req, res) => {
  res.json(mockInstallments);
});

app.post('/.netlify/functions/installments', (req, res) => {
  const newInstallment = { id: Date.now().toString(), ...req.body };
  mockInstallments.push(newInstallment);
  res.json(newInstallment);
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
});