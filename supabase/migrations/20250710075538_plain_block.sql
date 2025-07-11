/*
  # Create loans table

  1. New Tables
    - `loans`
      - `id` (text, primary key)
      - `borrower_id` (text, foreign key to borrowers)
      - `amount` (decimal, not null)
      - `interest_rate` (decimal, not null)
      - `start_date` (timestamp, not null)
      - `duration_months` (integer, not null)
      - `status` (text enum, default 'active')
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Foreign Keys
    - Links to borrowers table with cascade delete
*/

CREATE TABLE IF NOT EXISTS loans (
  id text PRIMARY KEY,
  borrower_id text NOT NULL REFERENCES borrowers(id) ON DELETE CASCADE,
  amount decimal(12,2) NOT NULL,
  interest_rate decimal(5,2) NOT NULL,
  start_date timestamp NOT NULL,
  duration_months integer NOT NULL,
  status text DEFAULT 'active' NOT NULL CHECK (status IN ('active', 'closed', 'defaulted')),
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);