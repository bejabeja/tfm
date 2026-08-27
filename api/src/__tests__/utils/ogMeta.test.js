import { describe, it, expect } from 'vitest';
import { buildItineraryOgMeta, buildUserOgMeta } from '../../utils/ogMeta.js';

const APP_URL = 'https://tobeatraveller.mabella.dev';

describe('buildItineraryOgMeta()', () => {
    it('uses the itinerary title and description when present', () => {
        const itinerary = {
            title: 'Two weeks in Japan',
            description: 'Temples, ramen and Mount Fuji.',
            tripTotalDays: 14,
            location: { name: 'Japan' },
            photoUrl: 'https://res.cloudinary.com/demo/image/upload/v1/trip.jpg',
        };

        const meta = buildItineraryOgMeta(itinerary, APP_URL);

        expect(meta.title).toBe('Two weeks in Japan');
        expect(meta.description).toBe('Temples, ramen and Mount Fuji.');
        expect(meta.imageUrl).toBe('https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1200/v1/trip.jpg');
    });

    it('falls back to a generic title when the itinerary has none', () => {
        const itinerary = { title: null, tripTotalDays: 5, location: { name: 'Lisbon' } };

        expect(buildItineraryOgMeta(itinerary, APP_URL).title).toBe('Trip on ToBeATraveller');
    });

    it('builds a description from days and destination when there is none', () => {
        const itinerary = { title: 'Trip', description: null, tripTotalDays: 5, location: { name: 'Lisbon' } };

        expect(buildItineraryOgMeta(itinerary, APP_URL).description).toBe('A 5-day trip to Lisbon');
    });

    it('falls back to "an amazing destination" when there is no location', () => {
        const itinerary = { title: 'Trip', description: null, tripTotalDays: 5, location: null };

        expect(buildItineraryOgMeta(itinerary, APP_URL).description).toBe('A 5-day trip to an amazing destination');
    });

    it('truncates a long description to 160 characters', () => {
        const itinerary = { title: 'Trip', description: 'x'.repeat(200) };

        expect(buildItineraryOgMeta(itinerary, APP_URL).description).toHaveLength(160);
    });

    it('falls back to the site hero image when there is no cover photo', () => {
        const itinerary = { title: 'Trip', photoUrl: null };

        expect(buildItineraryOgMeta(itinerary, APP_URL).imageUrl).toBe(`${APP_URL}/images/hero.jpg`);
    });
});

describe('buildUserOgMeta()', () => {
    it('uses the username as the title, prefixed with @', () => {
        expect(buildUserOgMeta({ username: 'ana' }).title).toBe('@ana');
    });

    it('prefers bio over about for the description', () => {
        const user = { username: 'ana', bio: 'Full-time traveller', about: 'Loves hiking' };

        expect(buildUserOgMeta(user).description).toBe('Full-time traveller');
    });

    it('falls back to about when there is no bio', () => {
        const user = { username: 'ana', bio: null, about: 'Loves hiking' };

        expect(buildUserOgMeta(user).description).toBe('Loves hiking');
    });

    it('falls back to a generic description when there is neither bio nor about', () => {
        const user = { username: 'ana', bio: null, about: null };

        expect(buildUserOgMeta(user).description).toBe("ana's travel itineraries on ToBeATraveller");
    });

    it('optimizes a Cloudinary avatar URL', () => {
        const user = { username: 'ana', avatarUrl: 'https://res.cloudinary.com/demo/image/upload/v1/ana.jpg' };

        expect(buildUserOgMeta(user).imageUrl).toBe('https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,w_1200/v1/ana.jpg');
    });

    it('passes through a non-Cloudinary avatar URL unchanged', () => {
        const user = { username: 'ana', avatarUrl: 'https://ui-avatars.com/api/?name=ana' };

        expect(buildUserOgMeta(user).imageUrl).toBe('https://ui-avatars.com/api/?name=ana');
    });
});
