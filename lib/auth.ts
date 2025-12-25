import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { SignJWT, jwtVerify } from 'jose'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production'

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword)
}

// For API routes (Node.js runtime) - use jsonwebtoken
export function generateToken(userId: string): string {
  if (!JWT_SECRET || JWT_SECRET === 'your-secret-key-change-this-in-production') {
    console.warn('WARNING: Using default JWT_SECRET. Set JWT_SECRET in .env file!')
  }
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' })
}

// For API routes (Node.js runtime) - use jsonwebtoken (synchronous)
export function verifyToken(token: string): { userId: string } | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }
    return decoded
  } catch (error) {
    console.error('Token verification failed:', error instanceof Error ? error.message : error)
    return null
  }
}

// For middleware (Edge runtime) - use jose (async)
export async function verifyTokenEdge(token: string): Promise<{ userId: string } | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    return { userId: payload.userId as string }
  } catch (error) {
    console.error('Token verification failed:', error instanceof Error ? error.message : error)
    return null
  }
}

