import Stripe from 'stripe';
import config from '../config/config.js';

export const stripeClient = new Stripe(config.stripeSecretKey);
