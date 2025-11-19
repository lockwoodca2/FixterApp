-- Add insured and after_hours_available columns to contractors table
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS insured BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE contractors ADD COLUMN IF NOT EXISTS after_hours_available BOOLEAN NOT NULL DEFAULT false;
