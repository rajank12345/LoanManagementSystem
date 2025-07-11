import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { 
  createBorrower, 
  getAllBorrowers, 
  updateBorrower as updateBorrowerDB, 
  deleteBorrower as deleteBorrowerDB,
  createLoan,
  getAllLoans,
  updateLoan as updateLoanDB,
  deleteLoan as deleteLoanDB,
  createInstallment,
  getAllInstallments,
  deleteInstallment as deleteInstallmentDB,
  getLoansWithBorrowers,
  getInstallmentsWithDetails
} from '../lib/db/operations';

// Updated types to match database schema
interface Borrower {
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

interface Loan {
  id: string;
  borrowerId: string;
  amount: number;
  interestRate: number;
  startDate: Date;
  durationMonths: number;
  status: 'active' | 'closed' | 'defaulted';
  createdAt: Date;
  updatedAt: Date;
}

interface Installment {
  id: string;
  loanId: string;
  amount: number;
  paymentDate: Date;
  createdAt: Date;
}

interface LoanWithDetails extends Loan {
  borrower: Borrower;
  installments: Installment[];
  totalPaid: number;
  remainingBalance: number;
  monthlyInstallment: number;
}

interface DashboardStats {
  totalLent: number;
  totalReceived: number;
  activeLoans: number;
  closedLoans: number;
  outstandingBalance: number;
}

interface LoanState {
  borrowers: Borrower[];
  loans: Loan[];
  installments: Installment[];
  loading: boolean;
  error: string | null;
}

type LoanAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_BORROWERS'; payload: Borrower[] }
  | { type: 'SET_LOANS'; payload: Loan[] }
  | { type: 'SET_INSTALLMENTS'; payload: Installment[] }
  | { type: 'ADD_BORROWER'; payload: Borrower }
  | { type: 'UPDATE_BORROWER'; payload: Borrower }
  | { type: 'DELETE_BORROWER'; payload: string }
  | { type: 'ADD_LOAN'; payload: Loan }
  | { type: 'UPDATE_LOAN'; payload: Loan }
  | { type: 'DELETE_LOAN'; payload: string }
  | { type: 'ADD_INSTALLMENT'; payload: Installment }
  | { type: 'DELETE_INSTALLMENT'; payload: string };

const initialState: LoanState = {
  borrowers: [],
  loans: [],
  installments: [],
  loading: false,
  error: null,
};

function loanReducer(state: LoanState, action: LoanAction): LoanState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_BORROWERS':
      return { ...state, borrowers: action.payload };
    case 'SET_LOANS':
      return { ...state, loans: action.payload };
    case 'SET_INSTALLMENTS':
      return { ...state, installments: action.payload };
    case 'ADD_BORROWER':
      return { ...state, borrowers: [action.payload, ...state.borrowers] };
    case 'UPDATE_BORROWER':
      return {
        ...state,
        borrowers: state.borrowers.map(b => b.id === action.payload.id ? action.payload : b)
      };
    case 'DELETE_BORROWER':
      return {
        ...state,
        borrowers: state.borrowers.filter(b => b.id !== action.payload)
      };
    case 'ADD_LOAN':
      return { ...state, loans: [action.payload, ...state.loans] };
    case 'UPDATE_LOAN':
      return {
        ...state,
        loans: state.loans.map(l => l.id === action.payload.id ? action.payload : l)
      };
    case 'DELETE_LOAN':
      return {
        ...state,
        loans: state.loans.filter(l => l.id !== action.payload)
      };
    case 'ADD_INSTALLMENT':
      return { ...state, installments: [action.payload, ...state.installments] };
    case 'DELETE_INSTALLMENT':
      return {
        ...state,
        installments: state.installments.filter(i => i.id !== action.payload)
      };
    default:
      return state;
  }
}

interface LoanContextType {
  state: LoanState;
  addBorrower: (borrower: Omit<Borrower, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBorrower: (borrower: Borrower) => Promise<void>;
  deleteBorrower: (id: string) => Promise<void>;
  addLoan: (loan: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateLoan: (loan: Loan) => Promise<void>;
  deleteLoan: (id: string) => Promise<void>;
  addInstallment: (installment: Omit<Installment, 'id' | 'createdAt'>) => Promise<void>;
  deleteInstallment: (id: string) => Promise<void>;
  getLoansWithDetails: () => LoanWithDetails[];
  getDashboardStats: () => DashboardStats;
  getLoansByBorrower: (borrowerId: string) => LoanWithDetails[];
  refreshData: () => Promise<void>;
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export function LoanProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(loanReducer, initialState);

  // Load initial data
  const loadData = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const [borrowersData, loansData, installmentsData] = await Promise.all([
        getAllBorrowers(),
        getAllLoans(),
        getAllInstallments()
      ]);

      // Convert database types to application types
      const borrowers = borrowersData.map(b => ({
        ...b,
        reference: (b.reference ?? '') as string,
        security: (b.security ?? '') as string,
        notes: (b.notes ?? '') as string,
        createdAt: new Date(b.createdAt),
        updatedAt: new Date(b.updatedAt)
      }));

      const loans = loansData.map(l => ({
        ...l,
        amount: parseFloat(l.amount),
        interestRate: parseFloat(l.interestRate),
        startDate: new Date(l.startDate),
        createdAt: new Date(l.createdAt),
        updatedAt: new Date(l.updatedAt)
      }));

      const installments = installmentsData.map(i => ({
        ...i,
        amount: parseFloat(i.amount),
        paymentDate: new Date(i.paymentDate),
        createdAt: new Date(i.createdAt)
      }));

      dispatch({ type: 'SET_BORROWERS', payload: borrowers });
      dispatch({ type: 'SET_LOANS', payload: loans });
      dispatch({ type: 'SET_INSTALLMENTS', payload: installments });
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load data from database' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const addBorrower = async (borrowerData: Omit<Borrower, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const borrower = await createBorrower(borrowerData);
      const formattedBorrower = {
        ...borrower,
        createdAt: new Date(borrower.createdAt),
        updatedAt: new Date(borrower.updatedAt)
      };
      dispatch({ type: 'ADD_BORROWER', payload: formattedBorrower });
    } catch (error) {
      console.error('Error adding borrower:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add borrower' });
    }
  };

  const updateBorrower = async (borrower: Borrower) => {
    try {
      const updated = await updateBorrowerDB(borrower.id, borrower);
      const formattedBorrower = {
        ...updated,
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt)
      };
      dispatch({ type: 'UPDATE_BORROWER', payload: formattedBorrower });
    } catch (error) {
      console.error('Error updating borrower:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update borrower' });
    }
  };

  const deleteBorrower = async (id: string) => {
    try {
      await deleteBorrowerDB(id);
      dispatch({ type: 'DELETE_BORROWER', payload: id });
    } catch (error) {
      console.error('Error deleting borrower:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete borrower' });
    }
  };

  const addLoan = async (loanData: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const loan = await createLoan(loanData);
      const formattedLoan = {
        ...loan,
        amount: parseFloat(loan.amount),
        interestRate: parseFloat(loan.interestRate),
        startDate: new Date(loan.startDate),
        createdAt: new Date(loan.createdAt),
        updatedAt: new Date(loan.updatedAt)
      };
      dispatch({ type: 'ADD_LOAN', payload: formattedLoan });
    } catch (error) {
      console.error('Error adding loan:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add loan' });
    }
  };

  const updateLoan = async (loan: Loan) => {
    try {
      const updated = await updateLoanDB(loan.id, loan);
      const formattedLoan = {
        ...updated,
        amount: parseFloat(updated.amount),
        interestRate: parseFloat(updated.interestRate),
        startDate: new Date(updated.startDate),
        createdAt: new Date(updated.createdAt),
        updatedAt: new Date(updated.updatedAt)
      };
      dispatch({ type: 'UPDATE_LOAN', payload: formattedLoan });
    } catch (error) {
      console.error('Error updating loan:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to update loan' });
    }
  };

  const deleteLoan = async (id: string) => {
    try {
      await deleteLoanDB(id);
      dispatch({ type: 'DELETE_LOAN', payload: id });
    } catch (error) {
      console.error('Error deleting loan:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete loan' });
    }
  };

  const addInstallment = async (installmentData: Omit<Installment, 'id' | 'createdAt'>) => {
    try {
      const installment = await createInstallment(installmentData);
      const formattedInstallment = {
        ...installment,
        amount: parseFloat(installment.amount),
        paymentDate: new Date(installment.paymentDate),
        createdAt: new Date(installment.createdAt)
      };
      dispatch({ type: 'ADD_INSTALLMENT', payload: formattedInstallment });
    } catch (error) {
      console.error('Error adding installment:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to add installment' });
    }
  };

  const deleteInstallment = async (id: string) => {
    try {
      await deleteInstallmentDB(id);
      dispatch({ type: 'DELETE_INSTALLMENT', payload: id });
    } catch (error) {
      console.error('Error deleting installment:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to delete installment' });
    }
  };

  const calculateMonthlyInstallment = (principal: number, rate: number, months: number): number => {
    const monthlyRate = rate / 100;
    const compound = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * compound) / (compound - 1);
  };

  const getLoansWithDetails = (): LoanWithDetails[] => {
    return state.loans.map(loan => {
      const borrower = state.borrowers.find(b => b.id === loan.borrowerId);
      const installments = state.installments.filter(i => i.loanId === loan.id);
      const totalPaid = installments.reduce((sum, i) => sum + i.amount, 0);

      // Flat monthly interest calculation as per user example
      const principal = loan.amount;
      const rate = loan.interestRate;
      const months = loan.durationMonths;
      const totalInterest = principal * months * rate / 100;
      const totalAmount = principal + totalInterest;
      const remainingBalance = Math.max(0, totalAmount - totalPaid);

      return {
        ...loan,
        borrower: borrower!,
        installments,
        totalPaid,
        remainingBalance,
        monthlyInstallment: months > 0 ? totalAmount / months : 0
      };
    });
  };

  const getDashboardStats = (): DashboardStats => {
    const loansWithDetails = getLoansWithDetails();
    const totalLent = loansWithDetails.reduce((sum, loan) => sum + loan.amount, 0);
    const totalReceived = loansWithDetails.reduce((sum, loan) => sum + loan.totalPaid, 0);
    const activeLoans = loansWithDetails.filter(loan => loan.status === 'active').length;
    const closedLoans = loansWithDetails.filter(loan => loan.status === 'closed').length;
    const outstandingBalance = loansWithDetails.reduce((sum, loan) => sum + loan.remainingBalance, 0);

    return {
      totalLent,
      totalReceived,
      activeLoans,
      closedLoans,
      outstandingBalance
    };
  };

  const getLoansByBorrower = (borrowerId: string): LoanWithDetails[] => {
    return getLoansWithDetails().filter(loan => loan.borrowerId === borrowerId);
  };

  const refreshData = async () => {
    await loadData();
  };

  return (
    <LoanContext.Provider value={{
      state,
      addBorrower,
      updateBorrower,
      deleteBorrower,
      addLoan,
      updateLoan,
      deleteLoan,
      addInstallment,
      deleteInstallment,
      getLoansWithDetails,
      getDashboardStats,
      getLoansByBorrower,
      refreshData
    }}>
      {children}
    </LoanContext.Provider>
  );
}

export function useLoan() {
  const context = useContext(LoanContext);
  if (!context) {
    throw new Error('useLoan must be used within a LoanProvider');
  }
  return context;
}