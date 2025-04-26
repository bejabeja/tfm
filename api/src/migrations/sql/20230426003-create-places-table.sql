CREATE TABLE IF NOT EXISTS places (
    id UUID PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    address VARCHAR(100),
    latitude DECIMAL(9, 6), --coming from google maps
    longitude DECIMAL(9, 6), --coming from google maps
    category VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);