import { ApolloServer } from '@apollo/server';

import { healthTypeDefs } from './schema/health.schema';
import { healthResolver } from './resolvers/health.resolver';

import { authTypeDefs } from '@/modules/auth/auth.schema';
import { authResolver } from '@/modules/auth/auth.resolver';
import { documentTypeDefs } from '@/modules/documents/document.schema';
import { chatTypeDefs } from '@/modules/ai/chat.schema';
import { documentResolver } from '@/modules/documents/document.resolver';
import { chatResolvers } from '@/modules/ai/chat.resolver';

export const apolloServer = new ApolloServer({
  typeDefs: [healthTypeDefs, authTypeDefs, documentTypeDefs, chatTypeDefs],
  resolvers: {
    Query: {
      ...healthResolver.Query,
      ...authResolver.Query,
      ...documentResolver.Query,
    },
    Mutation: {
      ...authResolver.Mutation,
      ...chatResolvers.Mutation,
    },
  },
});
