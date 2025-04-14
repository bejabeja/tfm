import jwt from 'jsonwebtoken';
import { AuthError } from '../errors/AuthError.js';

export const authenticate = (req, res, next) => {
    const token = req.cookies.access_token;
    console.log("token in authenticate", token);
    if (!token) {
        return AuthError('Unauthorized');
    }

    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        console.log("data in authenticate", data);
        req.user = data;
    } catch (error) {
        console.error("Error verifying token:", error);
        return AuthError('Unauthorized');
    }

    next();
}