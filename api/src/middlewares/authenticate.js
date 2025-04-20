import { AuthError } from '../errors/AuthError.js';
import { AuthService } from '../services/authService.js';
const authService = new AuthService();
export const authenticate = async (req, res, next) => {
    const token = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    console.log('Token:', token);
    console.log('Refresh Token:', refreshToken);
    if (!token && refreshToken) {
        try {
            await authService.refreshAccessToken(refreshToken, res, req);
            return next();
        } catch (error) {
            return next(error);
        }
    }

    console.log('Token 2:', token);


    if (!token) {
        return next(new AuthError('Unauthorized: No tokens provided'));
    }

    try {
        const decoded = authService.verifyAccessToken(token);
        req.user = decoded;
        return next();
    } catch (error) {
        if (error.name === 'TokenExpiredError' && refreshToken) {
            return authService.refreshAccessToken(refreshToken, res, next);
        }
        return next(new AuthError('Unauthorized: Invalid or expired access token'));
    }
}