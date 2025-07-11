import { pgTable, text, timestamp, integer, decimal, uuid, boolean } from 'drizzle-orm/pg-core';
import { createId } from '@paralleldrive/cuid2';

export const borrowers = pgTable('borrowers', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  contact: text('contact').notNull(),
  address: text('address').notNull(),
  reference: text('reference').default(''),
  security: text('security').default(''),
  notes: text('notes').default(''),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const loans = pgTable('loans', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  borrowerId: text('borrower_id').references(() => borrowers.id, { onDelete: 'cascade' }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  interestRate: decimal('interest_rate', { precision: 5, scale: 2 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  durationMonths: integer('duration_months').notNull(),
  status: text('status', { enum: ['active', 'closed', 'defaulted'] }).default('active').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const installments = pgTable('installments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  loanId: text('loan_id').references(() => loans.id, { onDelete: 'cascade' }).notNull(),
  amount: decimal('amount', { precision: 12, scale: 2 }).notNull(),
  paymentDate: timestamp('payment_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type Borrower = typeof borrowers.$inferSelect;
export type NewBorrower = typeof borrowers.$inferInsert;
export type Loan = typeof loans.$inferSelect;
export type NewLoan = typeof loans.$inferInsert;
export type Installment = typeof installments.$inferSelect;
export type NewInstallment = typeof installments.$inferInsert;