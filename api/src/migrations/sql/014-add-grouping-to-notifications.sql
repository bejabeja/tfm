ALTER TABLE notifications ADD COLUMN IF NOT EXISTS actor_ids UUID[] NOT NULL DEFAULT ARRAY[]::UUID[];
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMP WITH TIME ZONE;

UPDATE notifications SET last_activity_at = created_at WHERE last_activity_at IS NULL;
UPDATE notifications SET actor_ids = ARRAY[actor_id] WHERE array_length(actor_ids, 1) IS NULL;

ALTER TABLE notifications ALTER COLUMN last_activity_at SET NOT NULL;
ALTER TABLE notifications ALTER COLUMN last_activity_at SET DEFAULT NOW();
