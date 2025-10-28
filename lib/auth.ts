import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { adminAuth } from '@/lib/firebase-admin';

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    uid: string;
    email: string;
    name: string;
  };
}

export async function verifyToken(request: NextRequest): Promise<AuthenticatedRequest | null> {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return null;
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Verify with Firebase Admin
    const userRecord = await adminAuth.getUser(decoded.uid);
    
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = {
      uid: userRecord.uid,
      email: userRecord.email!,
      name: userRecord.displayName || '',
    };
    
    return authenticatedRequest;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}

export function createToken(uid: string): string {
  return jwt.sign({ uid }, process.env.JWT_SECRET!, { expiresIn: '7d' });
}

export function withAuth(handler: (req: AuthenticatedRequest) => Promise<NextResponse>) {
  return async (request: NextRequest) => {
    const authenticatedRequest = await verifyToken(request);
    
    if (!authenticatedRequest) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    return handler(authenticatedRequest);
  };
}

