import { apolloServer } from './graphql';
import { expressMiddleware } from '@as-integrations/express5';
import express from 'express';
import cors from 'cors';
import { createContext } from './graphql/context';
import documentRoutes from './modules/documents/document.route';
import chatRoutes from './modules/chat/chat.route';

export async function createApp() {
  await apolloServer.start();
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.use(
    '/api/graphql',
    expressMiddleware(apolloServer, {
      context: createContext,
    })
  );

  app.use('/api', documentRoutes);

  app.use('/api', chatRoutes);

  return app;
}
