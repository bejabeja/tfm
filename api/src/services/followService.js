import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

export class FollowService {
    constructor(userRepository, followRepository) {
        this.userRepository = userRepository;
        this.followRepository = followRepository;
    }

    async followUser(followerId, followedId) {
        if (followerId === followedId) {
            throw new ConflictError("You cannot follow yourself");
        }

        const followedUserExist = await this.userRepository.getUserById(followedId);
        if (!followedUserExist) {
            throw new NotFoundError("User to follow not found");
        }

        const alreadyFollowing = await this.followRepository.isFollowing(followerId, followedId);
        if (alreadyFollowing) {
            throw new ConflictError("Already following this user");
        }

        await this.followRepository.createFollow(followerId, followedId);
    }

    async unfollowUser(followerId, followedId) {
        const followedUser = await this.userRepository.getUserById(followedId);
        if (!followedUser) {
            throw new NotFoundError("User to unfollow not found");
        }

        await this.followRepository.deleteFollow(followerId, followedId);
    }

    async getFollowers(userId) {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        return this.followRepository.getFollowers(userId);
    }

    async getFollowing(userId) {
        const user = await this.userRepository.getUserById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }

        return this.followRepository.getFollowing(userId);
    }
}