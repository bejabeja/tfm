export class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService
    }

    async addComment(req, res, next) {
        try {
            const userId = req.user.id;
            const itineraryId = req.params.itineraryId;
            const content = req.body.text;

            const comment = await this.commentsService.addComment(userId, itineraryId, content);
            return res.status(201).json({ message: 'Comment added', comment });
        } catch (error) {
            next(error);
        }
    }

    async getComments(req, res, next) {
        try {
            const itineraryId = req.params.itineraryId;

            const comments = await this.commentsService.getCommentsByItinerary(itineraryId);

            return res.status(200).json(comments);
        } catch (error) {
            next(error);
        }
    }

    async deleteComment(req, res, next) {
        try {
            const commentId = req.params.commentId;
            const userId = req.user.id;

            await this.commentsService.deleteComment(commentId, userId);

            return res.status(204).json({ message: "Comment deleted" });
        } catch (error) {
            next(error);
        }
    }
}