import { prisma } from '@/lib/prisma';
import type { TextChunk, UploadDocumentInput } from './document.types';
import type { DocumentStatus } from '@/generated/prisma/enums';

export async function getDocuments() {
  return await prisma.document.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function getDocument(id: string) {
  return prisma.document.findUnique({
    where: {
      id,
    },
    include: {
      uploadedBy: true,
    },
  });
}

export async function getDocumentsByUserId(userId: string) {
  return prisma.document.findMany({
    where: {
      uploadedById: userId,
    },
    include: {
      uploadedBy: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
}

export async function uploadDocument(input: UploadDocumentInput) {
  return prisma.document.create({
    data: {
      title: input.title,
      originalFileName: input.file.originalname,
      storagePath: input.file.path,
      mimeType: input.file.mimetype,
      size: input.file.size,
      uploadedById: input.userId,
      status: 'PROCESSING',
    },
  });
}

export async function saveChunks(documentId: string, chunks: TextChunk[]) {
  await prisma.documentChunk.createMany({
    data: chunks.map((chunk) => ({
      documentId,
      chunkIndex: chunk.index,
      content: chunk.content,
    })),
  });
}

export async function updateDocumentStatus(
  documentID: string,
  status: DocumentStatus
) {
  await prisma.document.update({
    data: {
      status,
    },
    where: {
      id: documentID,
    },
  });
}

export async function saveEmbeddings(documentId: string, embeddings: string) {
  await prisma.$executeRaw`
    UPDATE "DocumentChunk"
    SET embedding = ${embeddings}::vector
    WHERE "documentId" = ${documentId}
  `;
}
