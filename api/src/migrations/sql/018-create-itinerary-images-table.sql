CREATE TABLE IF NOT EXISTS itinerary_images (
    id UUID PRIMARY KEY,
    itinerary_id UUID REFERENCES itineraries(id) ON DELETE CASCADE,
    photo_url TEXT NOT NULL,
    photo_public_id TEXT,
    order_index INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
