export function generateAvatar(username) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        username || "User Name"
    )}&background=random&size=128`;
}
