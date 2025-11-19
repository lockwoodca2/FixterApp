-- Update contractor 1 to have trust signals
UPDATE contractors 
SET 
  licensed = true,
  insured = true,
  after_hours_available = true
WHERE id = 1;
