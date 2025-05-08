-- Inserting new places
INSERT INTO places (id, title, description, label, address, latitude, longitude, category)
VALUES
  -- New York places
  ('d3f0f54c-8d91-4674-b8bc-fb3f1d55a923', 'Statue of Liberty', 'An iconic symbol of freedom located on Liberty Island in New York Harbor.', 'Liberty Island, New York, NY 10004, USA', '',  40.6892, -74.0445, 'Monument'),
  ('b7eae59b-364a-4931-a3b3-0a3b830b9ac1', 'Central Park', 'A large public park in the heart of Manhattan, known for its green spaces and recreational areas.', 'New York, NY 10024, USA', '', 40.7851, -73.9683, 'Park'),
  ('e3470f2c-321b-45e9-b3b3-e045cecd8d4e', 'Empire State Building', 'A 102-story skyscraper offering panoramic views of New York City from its observation decks.', '20 W 34th St, New York, NY 10118, USA', '', 40.748817, -73.985428, 'Building'),

  -- Tokyo places
  ('a7e5ff5e-b4c5-4dbf-944e-2ea10919b0fa', 'Tokyo Tower', 'A red and white tower inspired by the Eiffel Tower, offering views of the city.', '4-2-8 Shibakoen, Minato City, Tokyo 105-0011, Japan', '', 35.6586, 139.7454, 'Landmark'),
  ('f3470f2c-321b-45e9-b3b3-e045cecd8d4a', 'Sensō-ji Temple', 'Tokyo’s oldest temple located in Asakusa, famous for its vibrant entrance and shopping street.', '2-3-1 Asakusa, Taito City, Tokyo 111-0032, Japan', '', 35.7148, 139.7967, 'Temple'),
  ('d3f0f54c-8d91-4674-b8bc-fb3f1d55a921', 'Shibuya Crossing', 'A busy pedestrian crossing near Shibuya Station, often associated with the energy of Tokyo.', 'Shibuya, Tokyo, Japan', '', 35.6595, 139.7004, 'Square'),

  -- Rome places
  ('f7e5ff5e-b4c5-4dbf-944e-2ea10919b0fb', 'Vatican City', 'The independent city-state and headquarters of the Roman Catholic Church, home to St. Peter’s Basilica.', 'Vatican City, Rome, Italy', '', 41.9029, 12.4534, 'City-State'),
  ('b7eae59b-364a-4931-a3b3-0a3b830b9ac2', 'Pantheon', 'An ancient Roman temple, now a church, famous for its large dome and oculus.', 'Piazza della Rotonda, 00186 Roma RM, Italy', '', 41.8986, 12.4769, 'Building'),
  ('d3f0f54c-8d91-4674-b8bc-fb3f1d55a922', 'Colosseum', 'The largest ancient amphitheater in Rome, once used for gladiator battles and public spectacles.', 'Piazza del Colosseo, 00184 Roma RM, Italy', '', 41.8902, 12.4923, 'Amphitheater'),

  -- Sydney places
  ('d3f0f54c-8d91-4674-b8bc-fb3f1d55a924', 'Sydney Opera House', 'An architectural marvel and one of the most recognizable landmarks in Sydney.', 'Bennelong Point, Sydney NSW 2000, Australia', '', -33.8568, 151.2153, 'Theater'),
  ('b7eae59b-364a-4931-a3b3-0a3b830b9ac3', 'Bondi Beach', 'A famous beach in Sydney known for its surf culture and scenic coastal walks.', 'Bondi Beach, Sydney NSW 2026, Australia', '', -33.8915, 151.2767, 'Beach'),
  ('f3470f2c-321b-45e9-b3b3-e045cecd8d4b', 'Sydney Harbour Bridge', 'A large steel bridge that spans Sydney Harbour, offering views of the city and the Opera House.', 'Sydney Harbour Bridge, Sydney NSW, Australia', '', -33.8523, 151.2108, 'Bridge'),

  -- Paris places
  ('d3f0f54c-8d91-4674-b8bc-fb3f1d55a925', 'Eiffel Tower', 'The famous Parisian landmark, offering breathtaking views of the city from its observation decks.', 'Champ de Mars, 5 Avenue Anatole, 75007 Paris, France', '', 48.8584, 2.2945, 'Landmark'),
  ('f7e5ff5e-b4c5-4dbf-944e-2ea10919b0fc', 'Louvre Museum', 'The world’s largest art museum, home to the Mona Lisa and countless other masterpieces.', 'Rue de Rivoli, 75001 Paris, France', '', 48.8606, 2.3376, 'Museum'),
  ('b7eae59b-364a-4931-a3b3-0a3b830b9ac4', 'Montmartre', 'A historic area in Paris, known for its artistic heritage, the Sacré-Cœur, and picturesque streets.', 'Montmartre, Paris, France', '', 48.8867, 2.3431, 'Neighborhood'),

  -- Zurich places
  ('d3f0f54c-8d91-4674-b8bc-fb3f1d55a926', 'Old Town Zurich', 'A charming historic district with narrow alleys, medieval buildings, and the city’s main square.', 'Altstadt, Zürich, Switzerland', '', 47.3769, 8.5417, 'Historic District'),
  ('f7e5ff5e-b4c5-4dbf-944e-2ea10919b0fd', 'Lake Zurich', 'A scenic lake offering boat tours, swimming, and beautiful views of the surrounding mountains.', 'Lake Zurich, Switzerland', '', 47.3667, 8.5500, 'Lake'),
  ('b7eae59b-364a-4931-a3b3-0a3b830b9ac5', 'Swiss National Museum', 'A museum showcasing the cultural history and heritage of Switzerland, including art and artifacts from different epochs.', 'Museumstr. 2, 8001 Zürich, Switzerland', '', 47.3790, 8.5419, 'Museum'),

  -- Barcelona places
  ('d3f0f54c-8d91-4674-b8bc-fb3f1d55a927', 'Sagrada Familia', 'A large unfinished Roman Catholic basilica designed by architect Antoni Gaudí.', 'Carrer de Mallorca, 401, 08013 Barcelona, Spain', '', 41.4036, 2.1744, 'Basilica'),
  ('f7e5ff5e-b4c5-4dbf-944e-2ea10919b0fe', 'Park Güell', 'A public park filled with artistic structures and gardens designed by Antoni Gaudí.', 'Carrer d\Olot, 5, 08024 Barcelona, Spain', '', 41.4145, 2.1527, 'Park'),
  ('b7eae59b-364a-4931-a3b3-0a3b830b9ac6', 'La Rambla', 'A tree-lined street in the heart of Barcelona known for its shops and street performers.', 'La Rambla, 08002 Barcelona, Spain', '', 41.3809, 2.1734, 'Street');
