-- Needed for GDPR-grade forensic traceability (who did what, from where):
-- without these, a security investigation or breach report cannot correlate
-- an audit event with its network origin.
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS ip_address VARCHAR(45);
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS user_agent VARCHAR(500);
