-- actor_id/target_user_id are plain UUIDs, not FKs to users(id): the log must
-- survive the accounts it references (e.g. a deleted user's own delete_user entry).
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY,
    actor_id UUID,
    actor_username VARCHAR(50),
    action VARCHAR(50) NOT NULL,
    target_user_id UUID,
    target_username VARCHAR(50),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON audit_log(created_at DESC);
