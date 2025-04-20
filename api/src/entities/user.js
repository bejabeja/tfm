import { generateAvatar } from "../utils/avatar.js";
import { formatDate } from "../utils/date.js";

export class User {
    constructor(user) {
        this.id = user.id;
        this.username = user.username;
        this.email = user.email;
        this.password = user.password;
        this.location = user.location;
        this.avatarUrl = user.avatar_url || generateAvatar(user.username);
        this.createdAt = user.created_at;
        this.updatedAt = user.updated_at;

        this.name = user.name || "No nam";
        this.tripsShared = user.trips_shared || 0;
        this.followers = user.followers || 0;
        this.following = user.following || 0;
        this.itineraries = user.itineraries || [];
        this.bio = user.bio || "No bio available";
        this.about = user.about || "No about information available";
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
            tripsShared: this.tripsShared,
            followers: this.followers,
            following: this.following,
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
            tripsShared: this.tripsShared,
            avatarUrl: this.avatarUrl,
        };
    }
}