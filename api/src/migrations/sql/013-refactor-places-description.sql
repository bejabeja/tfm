-- Move description from places to itinerary_places, deduplicate places by coordinates

-- Step 1: Add description to itinerary_places
ALTER TABLE itinerary_places ADD COLUMN IF NOT EXISTS description TEXT;

-- Step 2: Migrate existing descriptions
UPDATE itinerary_places ip
SET description = p.description
FROM places p
WHERE ip.place_id = p.id;

-- Step 3: Re-link itinerary_places away from duplicate places (keep oldest per lat/lon)
WITH ranked AS (
    SELECT id, latitude, longitude,
           ROW_NUMBER() OVER (PARTITION BY latitude, longitude ORDER BY created_at) AS rn
    FROM places
    WHERE latitude != 0 OR longitude != 0
),
dupes AS (
    SELECT r.id AS dupe_id, k.keep_id
    FROM ranked r
    JOIN (SELECT latitude, longitude, id AS keep_id FROM ranked WHERE rn = 1) k
      ON r.latitude = k.latitude AND r.longitude = k.longitude
    WHERE r.rn > 1
)
UPDATE itinerary_places ip
SET place_id = d.keep_id
FROM dupes d
WHERE ip.place_id = d.dupe_id;

-- Step 4: Delete duplicate places
DELETE FROM places
WHERE id IN (
    SELECT id FROM (
        SELECT id,
               ROW_NUMBER() OVER (PARTITION BY latitude, longitude ORDER BY created_at) AS rn
        FROM places
        WHERE latitude != 0 OR longitude != 0
    ) t WHERE rn > 1
);

-- Step 5: Unique index on valid coordinates (excludes 0,0)
CREATE UNIQUE INDEX places_lat_lon_unique
ON places (latitude, longitude)
WHERE (latitude != 0 OR longitude != 0);

-- Step 6: Drop description from places
ALTER TABLE places DROP COLUMN description;
