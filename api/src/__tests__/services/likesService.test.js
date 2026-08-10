import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '../../errors/NotFoundError.js';
import { LikesService } from '../../services/likesService.js';

const makeItinerary = (overrides = {}) => ({
    id: 'itin-1',
    userId: 'owner-1',
    isPublic: true,
    ...overrides,
});

describe('LikesService', () => {
    let service;
    let likesRepository;
    let itineraryRepository;

    beforeEach(() => {
        likesRepository = {
            isLiked: vi.fn().mockResolvedValue(false),
            addLike: vi.fn().mockResolvedValue(),
            removeLike: vi.fn().mockResolvedValue(),
            getLikesCount: vi.fn().mockResolvedValue(1),
        };
        itineraryRepository = { findById: vi.fn() };
        service = new LikesService(likesRepository, null, itineraryRepository);
    });

    it('toggles a like on a public itinerary', async () => {
        itineraryRepository.findById.mockResolvedValue(makeItinerary({ isPublic: true }));

        await expect(service.toggleLike('itin-1', 'someone-else')).resolves.toEqual({ isLiked: true, likesCount: 1 });
    });

    it('throws NotFoundError when liking a private itinerary you do not own', async () => {
        itineraryRepository.findById.mockResolvedValue(makeItinerary({ isPublic: false }));

        await expect(service.toggleLike('itin-1', 'someone-else')).rejects.toThrow(NotFoundError);
        expect(likesRepository.addLike).not.toHaveBeenCalled();
    });

    it('throws NotFoundError when checking like status on a private itinerary you do not own', async () => {
        itineraryRepository.findById.mockResolvedValue(makeItinerary({ isPublic: false }));

        await expect(service.isLiked('itin-1', 'someone-else')).rejects.toThrow(NotFoundError);
    });

    it('allows the owner to like/check their own private itinerary', async () => {
        itineraryRepository.findById.mockResolvedValue(makeItinerary({ isPublic: false, userId: 'owner-1' }));

        await expect(service.isLiked('itin-1', 'owner-1')).resolves.toEqual({ isLiked: false, likesCount: 1 });
    });
});
