/**
 * JWT configuration constants
 */
export const jwtConstants = {
  secret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  expiresIn: process.env.JWT_EXPIRATION || '1h',
};
