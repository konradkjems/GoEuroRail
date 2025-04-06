import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify, JWTPayload } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export interface AuthUser extends JWTPayload {
  userId: string;
}

/**
 * Type guard to check if a JWTPayload contains the AuthUser properties
 */
function hasUserData(payload: JWTPayload): payload is AuthUser {
  return payload !== null && 
         typeof payload === 'object' && 
         'userId' in payload && 
         typeof payload.userId === 'string';
}

/**
 * Verifies the JWT token in cookies and returns the user information
 */
export async function verifyAuth(): Promise<AuthUser | null> {
  const cookieStore = cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (!token) {
    return null;
  }
  
  try {
    // Create a UInt8Array from the JWT_SECRET
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    // Verify token
    const { payload } = await jwtVerify(token, secret);
    
    // Check if payload has the required user data
    if (hasUserData(payload)) {
      return payload;
    }
    
    console.error('Token payload is missing userId');
    return null;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

/**
 * Middleware to protect API routes
 */
export async function authMiddleware(
  req: NextRequest, 
  handler: (req: NextRequest, user: AuthUser) => Promise<NextResponse>
): Promise<NextResponse> {
  const user = await verifyAuth();
  
  if (!user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  return handler(req, user);
}

/**
 * Check if the user is authenticated (for client-side use)
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await verifyAuth();
  return user !== null;
} 