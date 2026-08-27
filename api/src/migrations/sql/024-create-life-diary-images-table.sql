CREATE TABLE IF NOT EXISTS life_diary_images (
    id UUID PRIMARY KEY,
    entry_id UUID REFERENCES life_diary_entries(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    photo_public_id TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
