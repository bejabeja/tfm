CREATE TABLE IF NOT EXISTS places (
    id UUID PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    label TEXT,
    address TEXT,
    latitude DECIMAL(9, 6), --coming from google maps
    longitude DECIMAL(9, 6), --coming from google maps
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);