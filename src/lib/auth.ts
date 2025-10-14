import { getServerSession } from 'next-auth';
import { authOptions } from '@/server/auth';
import { redirect } from 'next/navigation';
import { User } from '@prisma/client';

export async function getCurrentUser(): Promise<User | null> {
  const session = await getServerSession(authOptions);
  return session?.user || null;
}

export async function requireUser(): Promise<User> {
  const user = await getCurrentUser();
  
  if (!user) {
    redirect('/login');
  }
  
  return user;
}

export async function requireAdmin(): Promise<User> {
  const user = await requireUser();
  
  if (user.role !== 'ADMIN') {
    redirect('/dashboard');
  }
  
  return user;
}

export function isOwner(userId: string, resourceUserId: string): boolean {
  return userId === resourceUserId;
}

export function canAccessResource(userId: string, resourceUserId: string, userRole: string): boolean {
  return userRole === 'ADMIN' || isOwner(userId, resourceUserId);
}

