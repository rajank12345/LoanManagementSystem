import { db } from './index';
import { borrowers, loans, installments, type Borrower, type Loan, type Installment } from './schema';
import { eq, desc } from 'drizzle-orm';

// Borrower operations
export async function createBorrower(data: Omit<Borrower, 'id' | 'createdAt' | 'updatedAt'>) {
  const [borrower] = await db.insert(borrowers).values({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  return borrower;
}

export async function getAllBorrowers() {
  return await db.select().from(borrowers).orderBy(desc(borrowers.createdAt));
}

export async function updateBorrower(id: string, data: Partial<Omit<Borrower, 'id' | 'createdAt'>>) {
  const [borrower] = await db.update(borrowers)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(borrowers.id, id))
    .returning();
  return borrower;
}

export async function deleteBorrower(id: string) {
  await db.delete(borrowers).where(eq(borrowers.id, id));
}

// Loan operations
export async function createLoan(data: Omit<Loan, 'id' | 'createdAt' | 'updatedAt'>) {
  const [loan] = await db.insert(loans).values({
    ...data,
    amount: data.amount.toString(),
    interestRate: data.interestRate.toString(),
    createdAt: new Date(),
    updatedAt: new Date(),
  }).returning();
  return loan;
}

export async function getAllLoans() {
  return await db.select().from(loans).orderBy(desc(loans.createdAt));
}

export async function updateLoan(id: string, data: Partial<Omit<Loan, 'id' | 'createdAt'>>) {
  const updateData: any = { ...data, updatedAt: new Date() };
  if (data.amount) updateData.amount = data.amount.toString();
  if (data.interestRate) updateData.interestRate = data.interestRate.toString();
  
  const [loan] = await db.update(loans)
    .set(updateData)
    .where(eq(loans.id, id))
    .returning();
  return loan;
}

export async function deleteLoan(id: string) {
  await db.delete(loans).where(eq(loans.id, id));
}

// Installment operations
export async function createInstallment(data: Omit<Installment, 'id' | 'createdAt'>) {
  const [installment] = await db.insert(installments).values({
    ...data,
    amount: data.amount.toString(),
    createdAt: new Date(),
  }).returning();
  return installment;
}

export async function getAllInstallments() {
  return await db.select().from(installments).orderBy(desc(installments.paymentDate));
}

export async function deleteInstallment(id: string) {
  await db.delete(installments).where(eq(installments.id, id));
}

// Get loans with borrower details
export async function getLoansWithBorrowers() {
  return await db.select({
    loan: loans,
    borrower: borrowers,
  }).from(loans)
    .leftJoin(borrowers, eq(loans.borrowerId, borrowers.id))
    .orderBy(desc(loans.createdAt));
}

// Get installments with loan and borrower details
export async function getInstallmentsWithDetails() {
  return await db.select({
    installment: installments,
    loan: loans,
    borrower: borrowers,
  }).from(installments)
    .leftJoin(loans, eq(installments.loanId, loans.id))
    .leftJoin(borrowers, eq(loans.borrowerId, borrowers.id))
    .orderBy(desc(installments.paymentDate));
}