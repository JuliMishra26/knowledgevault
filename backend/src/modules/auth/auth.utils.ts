import type { Request } from 'express';
import { verifyToken } from './jwt';
import { prisma } from '@/lib/prisma';

export function getBearerToken(req: Request): string | null {
  const authorization = req.headers.authorization;

  if (!authorization) {
    return null;
  }

  if (!authorization.startsWith('Bearer ')) {
    return null;
  }

  return authorization.substring(7);
}

export async function getAuthenticatedUser(token: string) {
  const payload = verifyToken(token);

  return prisma.user.findUnique({
    where: {
      id: payload.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });
}
