// lib/auth.ts

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// Get secrets
const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;
const JWT_ACCESS_EXPIRY = process.env.JWT_ACCESS_EXPIRY || '15m';
const JWT_REFRESH_EXPIRY = process.env.JWT_REFRESH_EXPIRY || '7d';

// Validate secrets exist
if (!JWT_SECRET || !JWT_REFRESH_SECRET) {
  console.error('❌ JWT secrets are not defined in environment variables!');
  
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Using fallback secrets for development only!');
  } else {
    throw new Error('JWT secrets are not defined in environment variables');
  }
}

// Use fallbacks in development
const effectiveJWTSecret = JWT_SECRET || (process.env.NODE_ENV === 'development' ? 'dev-secret-do-not-use-in-production' : '');
const effectiveRefreshSecret = JWT_REFRESH_SECRET || (process.env.NODE_ENV === 'development' ? 'dev-refresh-secret-do-not-use-in-production' : '');

// Types
export interface JWTPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Hash password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare password
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate access token (short-lived)
export function generateAccessToken(userId: string, email: string): string {
  const payload: JWTPayload = { userId, email, type: 'access' };
  // @ts-ignore - Bypass TypeScript strict checking for jwt.sign
  return jwt.sign(payload, effectiveJWTSecret, { expiresIn: JWT_ACCESS_EXPIRY });
}

// Generate refresh token (long-lived)
export function generateRefreshToken(userId: string, email: string): string {
  const payload: JWTPayload = { userId, email, type: 'refresh' };
  // @ts-ignore - Bypass TypeScript strict checking for jwt.sign
  return jwt.sign(payload, effectiveRefreshSecret, { expiresIn: JWT_REFRESH_EXPIRY });
}

// Generate both tokens
export function generateTokens(userId: string, email: string): TokenResponse {
  return {
    accessToken: generateAccessToken(userId, email),
    refreshToken: generateRefreshToken(userId, email)
  };
}

// Verify access token
export function verifyAccessToken(token: string): JWTPayload | null {
  try {
    // @ts-ignore - Bypass TypeScript strict checking for jwt.verify
    const decoded = jwt.verify(token, effectiveJWTSecret) as JWTPayload;
    if (decoded.type !== 'access') return null;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Verify refresh token
export function verifyRefreshToken(token: string): JWTPayload | null {
  try {
    // @ts-ignore - Bypass TypeScript strict checking for jwt.verify
    const decoded = jwt.verify(token, effectiveRefreshSecret) as JWTPayload;
    if (decoded.type !== 'refresh') return null;
    return decoded;
  } catch (error) {
    return null;
  }
}

// Create user
export async function createUser(email: string, password: string, name: string) {
  const passwordHash = await hashPassword(password);
  
  return prisma.user.create({
    data: {
      email,
      passwordHash,
      name,
      lastLoginAt: new Date()
    }
  });
}

// Authenticate user
export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  
  if (!user) return null;
  
  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) return null;
  
  return user;
}

// Save refresh token session
export async function saveRefreshTokenSession(
  userId: string, 
  refreshToken: string, 
  userAgent?: string, 
  ipAddress?: string
) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  
  return prisma.authSession.create({
    data: {
      userId,
      refreshToken,
      expiresAt,
      userAgent,
      ipAddress
    }
  });
}

// Revoke refresh token (logout)
export async function revokeRefreshToken(refreshToken: string) {
  return prisma.authSession.updateMany({
    where: { 
      refreshToken, 
      revokedAt: null 
    },
    data: { revokedAt: new Date() }
  });
}

// Get user by ID
export async function getUserById(userId: string) {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId }
  });
  const { passwordHash, ...userWithoutPassword } = user;
  return userWithoutPassword;
}