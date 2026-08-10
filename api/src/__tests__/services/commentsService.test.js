import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '../../errors/NotFoundError.js';
import { CommentsService } from '../../services/commentsService.js';

const makeItinerary = (overrides = {}) => ({
    id: 'itin-1',
    userId: 'owner-1',
    isPublic: true,
    ...overrides,
});

describe('CommentsService', () => {
    let service;
    let commentsRepository;
    let itineraryRepository;
    let notificationsService;

    beforeEach(() => {
        commentsRepository = {
            addComment: vi.fn().mockResolvedValue({ id: 'comment-1' }),
            getCommentsByItinerary: vi.fn().mockResolvedValue([{ toDTO: () => ({ id: 'comment-1' }) }]),
        };
        itineraryRepository = { findById: vi.fn() };
        notificationsService = { createNotification: vi.fn().mockResolvedValue() };
        service = new CommentsService(commentsRepository, {}, notificationsService, itineraryRepository);
    });

    describe('getCommentsByItinerary()', () => {
        it('returns comments for a public itinerary to anyone', async () => {
            itineraryRepository.findById.mockResolvedValue(makeItinerary({ isPublic: true }));

            await expect(service.getCommentsByItinerary('itin-1', undefined)).resolves.toEqual([{ id: 'comment-1' }]);
        });

        it('throws NotFoundError for a private itinerary requested by a non-owner', async () => {
            itineraryRepository.findById.mockResolvedValue(makeItinerary({ isPublic: false }));

            await expect(service.getCommentsByItinerary('itin-1', 'someone-else')).rejects.toThrow(NotFoundError);
            expect(commentsRepository.getCommentsByItinerary).not.toHaveBeenCalled();
        });

        it('returns comments for a private itinerary to its owner', async () => {
            itineraryRepository.findById.mockResolvedValue(makeItinerary({ isPublic: false }));

            await expect(service.getCommentsByItinerary('itin-1', 'owner-1')).resolves.toEqual([{ id: 'comment-1' }]);
        });
    });

    describe('addComment()', () => {
        it('adds a comment to a public itinerary and notifies the owner', async () => {
            itineraryRepository.findById.mockResolvedValue(makeItinerary({ isPublic: true }));

            await service.addComment('commenter-1', 'itin-1', 'Nice trip!');

            expect(commentsRepository.addComment).toHaveBeenCalledWith('commenter-1', 'itin-1', 'Nice trip!');
            expect(notificationsService.createNotification).toHaveBeenCalled();
        });

        it('throws NotFoundError when commenting on a private itinerary you do not own', async () => {
            itineraryRepository.findById.mockResolvedValue(makeItinerary({ isPublic: false }));

            await expect(service.addComment('someone-else', 'itin-1', 'hi')).rejects.toThrow(NotFoundError);
            expect(commentsRepository.addComment).not.toHaveBeenCalled();
        });

        it('allows commenting on your own private itinerary', async () => {
            itineraryRepository.findById.mockResolvedValue(makeItinerary({ isPublic: false, userId: 'owner-1' }));

            await expect(service.addComment('owner-1', 'itin-1', 'note to self')).resolves.toEqual({ id: 'comment-1' });
        });
    });
});
