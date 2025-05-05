INSERT INTO user_followers (id, follower_id, followed_id, created_at)
VALUES
-- demo1234 following
    ('a1001c6e-6e9e-11ee-b962-0242ac120111', 'c7b7fb94-ae30-4bbb-a71e-df24f96dd1cc', '33273cea-a2d5-4c46-a70d-c95f86c0c4e1', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120112', 'c7b7fb94-ae30-4bbb-a71e-df24f96dd1cc', '860681e5-f2d3-446f-bff4-ddabc4989484', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120113', 'c7b7fb94-ae30-4bbb-a71e-df24f96dd1cc', '82eeffd7-d10d-47eb-b06a-e45e576e4529', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120114', 'c7b7fb94-ae30-4bbb-a71e-df24f96dd1cc', '1b3d79ed-bc45-4f28-a581-e773500ec178', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120115', 'c7b7fb94-ae30-4bbb-a71e-df24f96dd1cc', '07db146f-8061-44a4-bbaf-b649fe018f07', NOW()),
    
-- demo1234 followers
    ('a1001c6e-6e9e-11ee-b962-0242ac120116', '33273cea-a2d5-4c46-a70d-c95f86c0c4e1', 'c7b7fb94-ae30-4bbb-a71e-df24f96dd1cc', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120117', '860681e5-f2d3-446f-bff4-ddabc4989484', 'c7b7fb94-ae30-4bbb-a71e-df24f96dd1cc', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120118', '82eeffd7-d10d-47eb-b06a-e45e576e4529', 'c7b7fb94-ae30-4bbb-a71e-df24f96dd1cc', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120119', '1b3d79ed-bc45-4f28-a581-e773500ec178', 'c7b7fb94-ae30-4bbb-a71e-df24f96dd1cc', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120120', '07db146f-8061-44a4-bbaf-b649fe018f07', 'c7b7fb94-ae30-4bbb-a71e-df24f96dd1cc', NOW()),

-- ss following
    ('a1001c6e-6e9e-11ee-b962-0242ac120121', '87a4b40c-f472-42ab-84f4-7befee5a6db2', '33273cea-a2d5-4c46-a70d-c95f86c0c4e1', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120122', '87a4b40c-f472-42ab-84f4-7befee5a6db2', '860681e5-f2d3-446f-bff4-ddabc4989484', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120123', '87a4b40c-f472-42ab-84f4-7befee5a6db2', '82eeffd7-d10d-47eb-b06a-e45e576e4529', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120124', '87a4b40c-f472-42ab-84f4-7befee5a6db2', '1b3d79ed-bc45-4f28-a581-e773500ec178', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120125', '87a4b40c-f472-42ab-84f4-7befee5a6db2', '07db146f-8061-44a4-bbaf-b649fe018f07', NOW()),

-- ss followers
    ('a1001c6e-6e9e-11ee-b962-0242ac120126', '1b3d79ed-bc45-4f28-a581-e773500ec178', '87a4b40c-f472-42ab-84f4-7befee5a6db2', NOW()),
    ('a1001c6e-6e9e-11ee-b962-0242ac120127', '07db146f-8061-44a4-bbaf-b649fe018f07', '87a4b40c-f472-42ab-84f4-7befee5a6db2', NOW());