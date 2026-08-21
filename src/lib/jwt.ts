import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.NEXTAUTH_SECRET || 'dev-secret-smkn1cisarua-connect-super-secure'
);

export interface UserSessionPayload {
  id: string;
  name: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'SUPER_ADMIN' | string;
  nis?: string | null;
  nip?: string | null;
  class?: string | null;
  major?: string | null;
  avatarUrl?: string | null;
}

export const COOKIE_NAME = 'ssc_auth_token';

// Sign JWT Session Token
export async function signJWTToken(payload: UserSessionPayload): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

// Verify JWT Token (Edge Compatible)
export async function verifyJWTToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    return verified.payload as unknown as UserSessionPayload;
  } catch (error) {
    return null;
  }
}
