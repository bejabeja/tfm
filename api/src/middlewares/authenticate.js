import { AuthError } from '../errors/AuthError.js';
import { AuthService } from '../services/authService.js';
const authService = new AuthService();
export const authenticate = async (req, res, next) => {
    const token = req.cookies.access_token;
    const refreshToken = req.cookies.refresh_token;
    
    if (!token && refreshToken) {
        try {
            await authService.refreshAccessToken(refreshToken, res, req);
            return next();
        } catch (error) {
            return next(error);
        }
    }

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