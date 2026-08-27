import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../db/clientPostgres.js', () => ({
    default: { query: vi.fn() },
}));

vi.mock('uuid', () => ({ v4: vi.fn(() => 'mock-uuid') }));

import client from '../../db/clientPostgres.js';
import { PackingChecklistRepository } from '../../repositories/packingChecklistRepository.js';

describe('PackingChecklistRepository', () => {
    const repo = new PackingChecklistRepository();

    beforeEach(() => {
        client.query.mockReset();
    });

    describe('createMany()', () => {
        it('inserts every item in a single query instead of one round trip per item', async () => {
            client.query.mockResolvedValue({
                rows: [
                    { id: 'a', user_id: 'user-1', category: 'clothing', name: 'Jacket', checked: false },
                    { id: 'b', user_id: 'user-1', category: 'clothing', name: 'Boots', checked: false },
                ],
            });

            const result = await repo.createMany('user-1', [
                { category: 'clothing', name: 'Jacket' },
                { category: 'clothing', name: 'Boots' },
            ]);

            expect(client.query).toHaveBeenCalledTimes(1);
            const [queryText, params] = client.query.mock.calls[0];
            expect(queryText).toMatch(/VALUES \(\$1, \$2, \$3, \$4\), \(\$5, \$6, \$7, \$8\)/);
            expect(params).toEqual(['mock-uuid', 'user-1', 'clothing', 'Jacket', 'mock-uuid', 'user-1', 'clothing', 'Boots']);
            expect(result).toHaveLength(2);
        });

        it('does not query the database at all for an empty item list', async () => {
            const result = await repo.createMany('user-1', []);

            expect(client.query).not.toHaveBeenCalled();
            expect(result).toEqual([]);
        });
    });

    describe('uncheckAll()', () => {
        it('unchecks every item for the user in a single query', async () => {
            client.query.mockResolvedValue({
                rows: [
                    { id: 'a', user_id: 'user-1', category: 'clothing', name: 'Jacket', checked: false },
                    { id: 'b', user_id: 'user-1', category: 'clothing', name: 'Boots', checked: false },
                ],
            });

            const result = await repo.uncheckAll('user-1');

            expect(client.query).toHaveBeenCalledTimes(1);
            const [queryText, params] = client.query.mock.calls[0];
            expect(queryText).toMatch(/UPDATE packing_checklist_items SET checked = false/);
            expect(params).toEqual(['user-1']);
            expect(result).toHaveLength(2);
        });
    });
});
