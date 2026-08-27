CREATE TABLE IF NOT EXISTS camp_diary_entries (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    location_name TEXT,
    location_country TEXT,
    location_label TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    entry_date DATE NOT NULL,
    best_moment TEXT,
    lesson_learned TEXT,
    memories TEXT,
    people_met TEXT,
    would_return BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
