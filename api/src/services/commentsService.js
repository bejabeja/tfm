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

}