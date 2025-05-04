
import { v4 as uuidv4 } from 'uuid';
import client from '../db/clientPostgres.js';

export class FollowRepository {
    async isFollowing(followerId, followedId) {
        const query = `
          SELECT 1
          FROM user_followers
          WHERE follower_id = $1 AND followed_id = $2
        `;
        const result = await client.query(query, [followerId, followedId]);
        return result.rows.length > 0;
    }

    async createFollow(followerId, followedId) {
        const followId = uuidv4();
        const query = `
          INSERT INTO user_followers (id, follower_id, followed_id, created_at)
          VALUES ($1, $2, $3, NOW())
        `;
        await client.query(query, [followId, followerId, followedId]);
    }

    async deleteFollow(followerId, followedId) {
        const query = `
          DELETE FROM user_followers
          WHERE follower_id = $1 AND followed_id = $2
        `;
        await client.query(query, [followerId, followedId]);
    }

    async getFollowers(userId) {
        const query = `
          SELECT users.*
          FROM user_followers
          JOIN users ON user_followers.follower_id = users.id
          WHERE user_followers.followed_id = $1
        `;
        const result = await client.query(query, [userId]);
        return result.rows;
    }

    async getFollowing(userId) {
        const query = `
          SELECT users.*
          FROM user_followers
          JOIN users ON user_followers.followed_id = users.id
          WHERE user_followers.follower_id = $1
        `;
        const result = await client.query(query, [userId]);
        return result.rows;
    }
}