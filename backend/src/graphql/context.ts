import type { Request } from 'express';

import {
  getAuthenticatedUser,
  getBearerToken,
} from '@/modules/auth/auth.utils';

export interface GraphQLContext {
  user: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export async function createContext({
  req,
}: {
  req: Request;
}): Promise<GraphQLContext> {
  const token = getBearerToken(req);

  if (!token) {
    return {
      user: null,
    };
  }

  try {
    const user = await getAuthenticatedUser(token);

    if (!user) {
      return {
        user: null,
      };
    }

    return {
      user,
    };
  } catch {
    return {
      user: null,
    };
  }
}
