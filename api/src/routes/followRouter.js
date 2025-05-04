import { Router } from "express";
import { FollowController } from "../controllers/followController.js";
import { FollowRepository } from "../repositories/followRepository.js";
import { UserRepository } from "../repositories/userRepository.js";
import { FollowService } from "../services/followService.js";

export const createFollowRouter = () => {
    const router = Router();
    const userRepository = new UserRepository();
    const followRepository = new FollowRepository();
    const followService = new FollowService(userRepository, followRepository);
    const followController = new FollowController(followService);

    router.post("/:id/follow", followController.followUser.bind(followController));
    router.delete("/:id/follow", followController.unfollowUser.bind(followController));
    router.get("/:id/followers", followController.getFollowers.bind(followController));
    router.get("/:id/following", followController.getFollowing.bind(followController));

    return router;
};
