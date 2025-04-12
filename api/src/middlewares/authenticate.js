import jwt from 'jsonwebtoken';

export const authenticate = (req, res, next) => {
    const token = req.cookies.access_token;
    
    try {
        const data = jwt.verify(token, process.env.JWT_SECRET);
        req.user = data;
    } catch (error) {
        return res.status(403).json({ error: 'Unauthorized' });
    }

    next();
}