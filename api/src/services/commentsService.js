import { AuthError } from "../errors/AuthError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class CommentsService {
    constructor(commentsRepository, userRepository) {
        this.commentsRepository = commentsRepository;
        this.userRepository = userRepository;
    }

    async addComment(userId, itineraryId, content) {
        return this.commentsRepository.addComment(userId, itineraryId, content);
    }

    async getCommentsByItinerary(itineraryId) {
        const comments = await this.commentsRepository.getCommentsByItinerary(itineraryId);
        return comments.map(comment => comment.toDTO());
    }

    async deleteComment(commentId, userId) {
        const comment = await this.commentsRepository.getCommentById(commentId);
        if (!comment) throw new NotFoundError("Comment not found");

        if (comment.user.id !== userId) {
            throw new AuthError();
        }

        await this.commentsRepository.deleteComment(commentId)
    }
}