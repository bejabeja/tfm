import { describe, it, expect } from 'vitest';
import { getOwnedEntity } from '../../utils/ownedEntity.js';

describe('getOwnedEntity()', () => {
    it('returns the entity when it exists and belongs to the requester', async () => {
        const repository = { findById: async () => ({ id: 'e-1', userId: 'user-1' }) };

        const entity = await getOwnedEntity(repository, 'e-1', 'user-1', 'Not found');

        expect(entity).toEqual({ id: 'e-1', userId: 'user-1' });
    });

    it('throws NotFoundError with the given message when the entity does not exist', async () => {
        const repository = { findById: async () => null };

        await expect(getOwnedEntity(repository, 'missing', 'user-1', 'Custom not found message'))
            .rejects.toThrow('Custom not found message');
    });

    it('throws AuthError when the entity belongs to a different user', async () => {
        const repository = { findById: async () => ({ id: 'e-1', userId: 'someone-else' }) };

        await expect(getOwnedEntity(repository, 'e-1', 'user-1', 'Not found'))
            .rejects.toThrow('Unauthorized');
    });
});
