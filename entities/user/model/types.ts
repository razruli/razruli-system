/**
 * User Entity - Authentication & User Identity
 * Represents a user authenticated via better-auth
 */

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  id: string;
  expiresAt: Date;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  ipAddress?: string | null;
  userAgent?: string | null;
  userId: string;
  user: User;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  name: string;
}

/**
 * Auth state from better-auth
 */
export interface AuthSession {
  user: User;
  session: Session;
}
