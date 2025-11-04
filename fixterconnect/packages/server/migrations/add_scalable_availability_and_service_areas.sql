-- ========================================
-- FixterConnect Database Migration
-- Add Scalable Availability & Service Areas
-- ========================================
-- This migration adds the new scalable availability system
-- and service areas feature WITHOUT deleting existing data.
-- Run this in your Supabase SQL Editor.

-- Step 1: Add new columns to existing 'availability' table
ALTER TABLE availability
ADD COLUMN IF NOT EXISTS day_of_week INT,
ADD COLUMN IF NOT EXISTS specific_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS max_bookings INT DEFAULT 8,
ADD COLUMN IF NOT EXISTS is_recurring BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Make the old 'date' column nullable (we use day_of_week and specific_date now)
ALTER TABLE availability
ALTER COLUMN date DROP NOT NULL;

-- Update existing availability records to be non-recurring (specific dates)
UPDATE availability
SET is_recurring = false,
    specific_date = date,
    max_bookings = 8
WHERE is_recurring IS NULL OR is_recurring = true;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_availability_contractor_day
ON availability(contractor_id, day_of_week);

CREATE INDEX IF NOT EXISTS idx_availability_contractor_specific
ON availability(contractor_id, specific_date);

-- Step 2: Add estimated_duration to bookings table
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS estimated_duration INT;

-- Add composite index for fast booking queries
CREATE INDEX IF NOT EXISTS idx_bookings_contractor_date_status
ON bookings(contractor_id, scheduled_date, status);

-- Step 3: Create new contractor_service_areas table
CREATE TABLE IF NOT EXISTS contractor_service_areas (
  id SERIAL PRIMARY KEY,
  contractor_id INT NOT NULL,
  day_of_week INT, -- 0=Sunday, 1=Monday, etc. NULL = all days
  area VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  CONSTRAINT fk_contractor_service_areas_contractor
    FOREIGN KEY (contractor_id)
    REFERENCES contractors(id)
    ON DELETE CASCADE
);

-- Add indexes for service areas
CREATE INDEX IF NOT EXISTS idx_contractor_service_areas_contractor_day
ON contractor_service_areas(contractor_id, day_of_week);

CREATE INDEX IF NOT EXISTS idx_contractor_service_areas_area
ON contractor_service_areas(area);

-- Step 4: Add trigger to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to availability table
DROP TRIGGER IF EXISTS update_availability_updated_at ON availability;
CREATE TRIGGER update_availability_updated_at
    BEFORE UPDATE ON availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add trigger to contractor_service_areas table
DROP TRIGGER IF EXISTS update_contractor_service_areas_updated_at ON contractor_service_areas;
CREATE TRIGGER update_contractor_service_areas_updated_at
    BEFORE UPDATE ON contractor_service_areas
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- Migration Complete!
-- ========================================
-- Summary of changes:
-- ✅ Added columns to 'availability' table (day_of_week, specific_date, max_bookings, is_recurring, updated_at)
-- ✅ Added 'estimated_duration' to 'bookings' table
-- ✅ Created 'contractor_service_areas' table
-- ✅ Added performance indexes
-- ✅ Added auto-update triggers for timestamps
-- ✅ Preserved all existing data (users, bookings, messages, etc.)
--
-- Next Steps:
-- 1. Contractors can now set their weekly schedule in the Dashboard
-- 2. Service areas will be saved to the new table
-- 3. Availability is calculated dynamically from confirmed bookings
-- ========================================
