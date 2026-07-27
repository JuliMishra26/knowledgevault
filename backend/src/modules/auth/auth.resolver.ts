import type { GraphQLContext } from '@/graphql/context';
import * as authService from './auth.services';
import type { LoginInput, RegisterInput } from './auth.types';
import { authenticated } from './auth.graphql';

export const authResolver = {
  Query: {
    me: authenticated((_, __, context: GraphQLContext) => {
      return context.user;
    }),
    users: authenticated(() => {
      return authService.getUsers();
    }),
  },

  Mutation: {
    register: (_: unknown, args: { input: RegisterInput }) => {
      return authService.register(args.input);
    },

    login: (_: unknown, args: { input: LoginInput }) => {
      return authService.login(args.input);
    },
  },
};
