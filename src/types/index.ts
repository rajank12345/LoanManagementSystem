export interface Borrower {
  id: string;
  name: string;
  contact: string;
  address: string;
  reference: string;
  security: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Loan {
  id: string;
  borrowerId: string;
  amount: number;
  interestRate: number; // Monthly percentage
  startDate: Date;
  durationMonths: number;
  status: 'active' | 'closed' | 'defaulted';
  createdAt: Date;
  updatedAt: Date;
}

export interface Installment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: Date;
  createdAt: Date;
}

export interface LoanWithDetails extends Loan {
  borrower: Borrower;
  installments: Installment[];
  totalPaid: number;
  remainingBalance: number;
  monthlyInstallment: number;
}

export interface DashboardStats {
  totalLent: number;
  totalReceived: number;
  activeLoans: number;
  closedLoans: number;
  outstandingBalance: number;
}