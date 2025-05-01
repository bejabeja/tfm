import { generateAvatar } from "../utils/avatar.js";
import { formatDate } from "../utils/date.js";

export class User {
    constructor({ id, username, email, password, location, avatarUrl, createdAt, updatedAt, name, followersList, followingList, itineraries, bio, about, totalItineraries }) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.password = password;
        this.location = location;
        this.avatarUrl = avatarUrl || generateAvatar(username);
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.name = name || "No name";
        this.followersList = followersList || [];
        this.followingList = followingList || [];
        this.itineraries = itineraries || [];
        this.bio = bio || "No bio available";
        this.about = about || "No about information available";
        this.totalItineraries = totalItineraries || 0;
    }

    static fromDb(row) {
        return new User({
            id: row.id,
            username: row.username,
            email: row.email,
            password: row.password,
            location: row.location,
            avatarUrl: row.avatar_url,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            name: row.name,
            bio: row.bio,
            about: row.about
        });
    }

    updateProfile(name, location, avatarUrl, bio, about, username) {
        this.name = name;
        this.location = location;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.about = about;
        this.username = username;
        this.updatedAt = new Date();
    }

    countItineraries() {
        return this.itineraries.length || this.totalItineraries;
    }

    totalFollowers() {
        return this.followersList.length;
    }

    totalFollowing() {
        return this.followingList.length;
    }

    toDTO() {
        return {
            id: this.id,
            username: this.username,
            email: this.email,
            location: this.location,
            avatarUrl: this.avatarUrl,
            createdAt: formatDate(this.createdAt),
            updatedAt: formatDate(this.updatedAt),
            name: this.name,
            totalItineraries: this.countItineraries(),
            followersList: this.followersList,
            followingList: this.followingList,
            followers: this.totalFollowers(),
            following: this.totalFollowing(),
            itineraries: this.itineraries,
            bio: this.bio,
            about: this.about
        };
    }

    toSimpleDTO() {
        return {
            id: this.id,
            username: this.username,
            avatarUrl: this.avatarUrl,
        };
    }

    toFeaturedDTO() {
        return {
            id: this.id,
            username: this.username,
            location: this.location,
            totalItineraries: this.countItineraries(),
            avatarUrl: this.avatarUrl,
        };
    }

}