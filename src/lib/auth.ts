import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { COOKIE_NAME, verifyJWTToken, signJWTToken, UserSessionPayload } from '@/lib/jwt';

export type { UserSessionPayload };
export { COOKIE_NAME, verifyJWTToken, signJWTToken };

// Hash password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10);
}

// Compare password
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
}

// Get Session from Cookie (Server Components / Route Handlers)
export async function getSession(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyJWTToken(token);
  } catch (error) {
    return null;
  }
}
