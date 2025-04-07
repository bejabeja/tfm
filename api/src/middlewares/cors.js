import cors from 'cors';
import 'dotenv/config';


const ACCEPTED_ORIGINS = [process.env.ORIGIN_ONE];
export const corsMiddleware = ({ acceptedOrigins = ACCEPTED_ORIGINS } = {}) => cors(
    {
        origin: (origin, callback) => {
            if (acceptedOrigins.includes(origin)) {
                return callback(null, true);
            }
            if (!origin) {
                return callback(null, true);
            }
            return callback(new Error('CORS policy error'));
        },
    }
);
