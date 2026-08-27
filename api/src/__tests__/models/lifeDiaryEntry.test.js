import { describe, it, expect } from 'vitest';
import { LifeDiaryEntry } from '../../models/lifeDiaryEntry.js';

const baseRow = {
    id: 'entry-1', user_id: 'user-1',
    location_name: null, location_country: null, location_label: null, latitude: null, longitude: null,
    entry_date: '2026-03-01', best_moment: null, lesson_learned: null, memories: null,
    people_met: null, would_return: null, created_at: null, updated_at: null,
};

describe('LifeDiaryEntry.fromDb()', () => {
    it('builds a location object when only name is present', () => {
        const entry = LifeDiaryEntry.fromDb({ ...baseRow, location_name: 'Camping Els Pins' });

        expect(entry.location).toEqual({ name: 'Camping Els Pins', country: null, label: null, lat: null, lon: null });
    });

    it('builds a location object when only country and coordinates are present, no name or label', () => {
        const entry = LifeDiaryEntry.fromDb({ ...baseRow, location_country: 'Spain', latitude: '41.5', longitude: '2.1' });

        expect(entry.location).toEqual({ name: null, country: 'Spain', label: null, lat: '41.5', lon: '2.1' });
    });

    it('returns null location when nothing was ever saved', () => {
        const entry = LifeDiaryEntry.fromDb(baseRow);

        expect(entry.location).toBeNull();
    });
});
