import { authenticated } from '../auth/auth.graphql';
import * as documentService from './document.services';

export const documentResolver = {
  Query: {
    documents: authenticated(() => documentService.getDocuments()),
    document: authenticated((_: unknown, args: { id: string }) =>
      documentService.getDocument(args.id)
    ),
  },
};
