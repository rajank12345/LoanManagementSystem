/*
  # Create installments table

  1. New Tables
    - `installments`
      - `id` (text, primary key)
      - `loan_id` (text, foreign key to loans)
      - `amount` (decimal, not null)
      - `payment_date` (timestamp, not null)
      - `created_at` (timestamp, default now)

  2. Foreign Keys
    - Links to loans table with cascade delete
*/

CREATE TABLE IF NOT EXISTS installments (
  id text PRIMARY KEY,
  loan_id text NOT NULL REFERENCES loans(id) ON DELETE CASCADE,
  amount decimal(12,2) NOT NULL,
  payment_date timestamp NOT NULL,
  created_at timestamp DEFAULT now() NOT NULL
);