import jwt from 'jsonwebtoken';
import { AuthError } from '../errors/AuthError.js';
import config from '../config/config.js';

export const authenticate = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
        return AuthError('Unauthorized');
    }

    try {
        const data = jwt.verify(token, config.jwtSecret);
        req.user = data;
    } catch (error) {
        console.error("Error verifying token:", error);
        return AuthError('Unauthorized');
    }

    next();
}