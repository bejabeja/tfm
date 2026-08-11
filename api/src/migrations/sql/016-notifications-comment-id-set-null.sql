ALTER TABLE notifications DROP CONSTRAINT IF EXISTS notifications_comment_id_fkey;
ALTER TABLE notifications
    ADD CONSTRAINT notifications_comment_id_fkey
    FOREIGN KEY (comment_id) REFERENCES itinerary_comments(id) ON DELETE SET NULL;
