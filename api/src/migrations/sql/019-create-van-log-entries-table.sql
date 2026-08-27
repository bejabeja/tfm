CREATE TABLE IF NOT EXISTS van_log_entries (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(20) NOT NULL,
    title VARCHAR(255),
    amount DECIMAL(10,2),
    currency VARCHAR(3),
    location_name TEXT,
    location_country TEXT,
    location_label TEXT,
    latitude DECIMAL(9,6),
    longitude DECIMAL(9,6),
    notes TEXT,
    entry_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
