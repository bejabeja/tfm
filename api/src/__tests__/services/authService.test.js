import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock external modules before importing the service
vi.mock('bcrypt', () => ({
    default: {
        compare: vi.fn(),
    },
}));

vi.mock('jsonwebtoken', () => ({
    default: {
        sign: vi.fn(),
        verify: vi.fn(),
    },
}));

vi.mock('../../config/config.js', () => ({
    default: {
        jwtSecret: 'test-secret',
        jwtRefreshSecret: 'test-refresh-secret',
        nodeEnv: 'test',
    },
}));

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AuthService } from '../../services/authService.js';
import { AuthError } from '../../errors/AuthError.js';
import { NotFoundError } from '../../errors/NotFoundError.js';

const mockUser = {
    id: 'user-1',
    username: 'johndoe',
    password: 'hashed_password',
    toSimpleDTO: () => ({ id: 'user-1', username: 'johndoe', avatarUrl: 'https://...', role: 'user' }),
};

describe('AuthService', () => {
    let authService;
    let mockUserRepository;

    beforeEach(() => {
        vi.clearAllMocks();
        mockUserRepository = {
            findByEmail: vi.fn(),
        };
        authService = new AuthService(mockUserRepository);
    });

    describe('login()', () => {
        it('returns user DTO when credentials are valid', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(true);

            const result = await authService.login({ email: 'johndoe@example.com', password: 'correctpassword' });

            expect(mockUserRepository.findByEmail).toHaveBeenCalledWith('johndoe@example.com');
            expect(bcrypt.compare).toHaveBeenCalledWith('correctpassword', 'hashed_password');
            expect(result).toEqual({ id: 'user-1', username: 'johndoe', avatarUrl: 'https://...', role: 'user' });
        });

        it('throws NotFoundError when user does not exist', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(null);

            await expect(authService.login({ email: 'unknown@example.com', password: 'pass' }))
                .rejects.toThrow(NotFoundError);
        });

        it('throws AuthError when password is incorrect', async () => {
            mockUserRepository.findByEmail.mockResolvedValue(mockUser);
            bcrypt.compare.mockResolvedValue(false);

            await expect(authService.login({ email: 'johndoe@example.com', password: 'wrongpassword' }))
                .rejects.toThrow(AuthError);
        });
    });

    describe('generateAccessToken()', () => {
        it('calls jwt.sign with correct arguments and returns token', () => {
            jwt.sign.mockReturnValue('access-token-xyz');

            const token = authService.generateAccessToken({ id: 'user-1', username: 'johndoe', role: 'user' });

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'user-1', username: 'johndoe', role: 'user' },
                'test-secret',
                { expiresIn: '1h' }
            );
            expect(token).toBe('access-token-xyz');
        });
    });

    describe('generateRefreshToken()', () => {
        it('calls jwt.sign with refresh secret and 7d expiry', () => {
            jwt.sign.mockReturnValue('refresh-token-xyz');

            const token = authService.generateRefreshToken({ id: 'user-1', username: 'johndoe', role: 'user' });

            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'user-1', username: 'johndoe', role: 'user' },
                'test-refresh-secret',
                { expiresIn: '7d' }
            );
            expect(token).toBe('refresh-token-xyz');
        });
    });

    describe('verifyAccessToken()', () => {
        it('returns the decoded payload when token is valid', () => {
            const payload = { id: 'user-1', username: 'johndoe' };
            jwt.verify.mockReturnValue(payload);

            const result = authService.verifyAccessToken('valid-token');

            expect(jwt.verify).toHaveBeenCalledWith('valid-token', 'test-secret');
            expect(result).toEqual(payload);
        });

        it('throws AuthError when token is invalid', () => {
            jwt.verify.mockImplementation(() => { throw new Error('invalid'); });

            expect(() => authService.verifyAccessToken('bad-token'))
                .toThrow(AuthError);
        });

        it('throws an error named TokenExpiredError when the token expired, so authenticate.js can detect it', () => {
            const expired = new Error('jwt expired');
            expired.name = 'TokenExpiredError';
            jwt.verify.mockImplementation(() => { throw expired; });

            try {
                authService.verifyAccessToken('expired-token');
                throw new Error('expected verifyAccessToken to throw');
            } catch (error) {
                expect(error).toBeInstanceOf(AuthError);
                expect(error.name).toBe('TokenExpiredError');
            }
        });
    });

    describe('refreshAccessTokenFromToken()', () => {
        it('mints a new access token from a valid refresh token', () => {
            jwt.verify.mockReturnValue({ id: 'user-1', username: 'johndoe', role: 'user' });
            jwt.sign.mockReturnValue('new-access-token');

            const token = authService.refreshAccessTokenFromToken('valid-refresh-token');

            expect(jwt.verify).toHaveBeenCalledWith('valid-refresh-token', 'test-refresh-secret');
            expect(jwt.sign).toHaveBeenCalledWith(
                { id: 'user-1', username: 'johndoe', role: 'user' },
                'test-secret',
                { expiresIn: '1h' }
            );
            expect(token).toBe('new-access-token');
        });

        it('carries the role from the refresh token so an admin does not lose access after a refresh', () => {
            jwt.verify.mockReturnValue({ id: 'user-1', username: 'johndoe', role: 'admin' });
            jwt.sign.mockReturnValue('new-access-token');

            authService.refreshAccessTokenFromToken('valid-refresh-token');

            expect(jwt.sign).toHaveBeenCalledWith(
                expect.objectContaining({ role: 'admin' }),
                'test-secret',
                { expiresIn: '1h' }
            );
        });

        it('throws AuthError when the refresh token is invalid or expired', () => {
            jwt.verify.mockImplementation(() => { throw new Error('jwt expired'); });

            expect(() => authService.refreshAccessTokenFromToken('bad-refresh-token'))
                .toThrow(AuthError);
        });
    });
});
