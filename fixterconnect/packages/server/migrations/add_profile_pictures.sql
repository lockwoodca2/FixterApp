-- Add profile_picture column to contractors table
ALTER TABLE contractors
ADD COLUMN IF NOT EXISTS profile_picture TEXT;

-- Add profile_picture column to clients table
ALTER TABLE clients
ADD COLUMN IF NOT EXISTS profile_picture TEXT;
