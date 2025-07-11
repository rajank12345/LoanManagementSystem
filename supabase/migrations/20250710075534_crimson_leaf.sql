/*
  # Create borrowers table

  1. New Tables
    - `borrowers`
      - `id` (text, primary key)
      - `name` (text, not null)
      - `contact` (text, not null)
      - `address` (text, not null)
      - `reference` (text, default empty string)
      - `security` (text, default empty string)
      - `notes` (text, default empty string)
      - `created_at` (timestamp, default now)
      - `updated_at` (timestamp, default now)

  2. Security
    - No RLS needed for this application as it's a single-user system
*/

CREATE TABLE IF NOT EXISTS borrowers (
  id text PRIMARY KEY,
  name text NOT NULL,
  contact text NOT NULL,
  address text NOT NULL,
  reference text DEFAULT '',
  security text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamp DEFAULT now() NOT NULL,
  updated_at timestamp DEFAULT now() NOT NULL
);