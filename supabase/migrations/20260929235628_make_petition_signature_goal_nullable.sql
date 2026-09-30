-- Make petitions.signature_goal nullable
-- This allows petitions to be created without a signature goal
-- The application UI handles missing goals gracefully

ALTER TABLE petitions ALTER COLUMN signature_goal DROP NOT NULL;
