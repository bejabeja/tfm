export class FollowController {
    constructor(followService) {
        this.followService = followService
    }

    async followUser(req, res, next) {
        try {
            const followerId = req.user.id;
            const followedId = req.params.id;

            await this.followService.followUser(followerId, followedId);
            res.status(200).json({ message: "User followed successfully" });
        } catch (error) {
            next(error);
        }
    }

    async unfollowUser(req, res, next) {
        try {
            const followerId = req.user.id;
            const followedId = req.params.id;
            await this.followService.unfollowUser(followerId, followedId);
            res.status(200).json({ message: "User unfollowed successfully" });
        } catch (error) {
            next(error);
        }
    }

    async getFollowers(req, res, next) {
        try {
            const userId = req.params.id;
            const followers = await this.followService.getFollowers(userId);
            res.status(200).json(followers);
        } catch (error) {
            next(error);
        }
    }

    async getFollowing(req, res, next) {
        try {
            const userId = req.params.id;
            const following = await this.followService.getFollowing(userId);
            res.status(200).json(following);
        } catch (error) {
            next(error);
        }
    }
}