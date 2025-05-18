import { Router } from "express";
import { CommentsController } from "../controllers/commentsController.js";
import { authenticate } from "../middlewares/authenticate.js";
import { CommentsRepository } from "../repositories/commentsRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { CommentsService } from "../services/commentsService.js";

export const createCommentsRouter = () => {
    const router = Router()

    const commentsRepository = new CommentsRepository()
    const userRepository = new UserRepository()
    const commentsService = new CommentsService(commentsRepository, userRepository)
    const commentsController = new CommentsController(commentsService)

    router.get('/itinerary/:itineraryId', commentsController.getComments.bind(commentsController));
    router.post('/itinerary/:itineraryId', authenticate, commentsController.addComment.bind(commentsController));
    router.delete('/:commentId', authenticate, commentsController.deleteComment.bind(commentsController));

    return router;
}