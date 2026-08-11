import { commentSchema } from "../utils/schemasValidation.js";
import { ValidationError } from "../errors/ValidationError.js";

export class CommentsController {
    constructor(commentsService) {
        this.commentsService = commentsService
    }

    async addComment(req, res, next) {
        const result = commentSchema.safeParse(req.body);
        if (!result.success) {
            return next(new ValidationError(result.error.errors[0]?.message || "Invalid comment"));
        }
        try {
            const userId = req.user.id;
            const itineraryId = req.params.itineraryId;
            const content = result.data.text;

            const comment = await this.commentsService.addComment(userId, itineraryId, content);
            return res.status(201).json({ message: 'Comment added', comment });
        } catch (error) {
            next(error);
        }
    }

    async getComments(req, res, next) {
        try {
            const itineraryId = req.params.itineraryId;

            const comments = await this.commentsService.getCommentsByItinerary(itineraryId, req.user?.id);

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