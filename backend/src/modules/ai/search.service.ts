import { prisma } from '@/lib/prisma';
import { generateEmbedding } from './ollama.provider';

export interface SearchChunk {
  id: string;
  documentId: string;
  chunkIndex: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  distance: number;
}

export async function searchSimilarChunks(question: string, limit = 5) {
  const embedding = await generateEmbedding(question);

  const vector = `[${embedding.join(',')}]`;

  const chunks = await prisma.$queryRawUnsafe<SearchChunk[]>(`
    SELECT
        id,
        "documentId",
        "chunkIndex",
        content,
        "createdAt",
        "updatedAt",
        embedding <=> '${vector}'::vector AS distance
    FROM "DocumentChunk"
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> '${vector}'::vector
    LIMIT ${limit};
`);

  return chunks;
}
