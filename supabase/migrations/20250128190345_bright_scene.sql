/*
  # Initial Schema for AI Fitness Coach

  1. New Tables
    - users
      - id (uuid, primary key)
      - email (text)
      - full_name (text)
      - created_at (timestamp)
    - workouts
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - name (text)
      - date (date)
      - completed (boolean)
      - created_at (timestamp)
    - exercises
      - id (uuid, primary key)
      - workout_id (uuid, foreign key)
      - name (text)
      - sets (integer)
      - reps (integer)
      - weight (numeric)
      - completed (boolean)
    - progress_metrics
      - id (uuid, primary key)
      - user_id (uuid, foreign key)
      - metric_type (text)
      - value (numeric)
      - date (date)
      - notes (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table (extends Supabase auth.users)
CREATE TABLE users (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  full_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Workouts table
CREATE TABLE workouts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  name text NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Exercises table
CREATE TABLE exercises (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_id uuid REFERENCES workouts(id) NOT NULL,
  name text NOT NULL,
  sets integer NOT NULL,
  reps integer NOT NULL,
  weight numeric,
  completed boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Progress metrics table
CREATE TABLE progress_metrics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) NOT NULL,
  metric_type text NOT NULL,
  value numeric NOT NULL,
  date date NOT NULL DEFAULT CURRENT_DATE,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_metrics ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own data"
  ON users
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can read own workouts"
  ON workouts
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own workouts"
  ON workouts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own workouts"
  ON workouts
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can read own exercises"
  ON exercises
  FOR ALL
  TO authenticated
  USING (workout_id IN (
    SELECT id FROM workouts WHERE user_id = auth.uid()
  ));

CREATE POLICY "Users can read own metrics"
  ON progress_metrics
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own metrics"
  ON progress_metrics
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());