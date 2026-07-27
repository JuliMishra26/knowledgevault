import * as documentService from './document.services';
import { PDFParse } from 'pdf-parse';
import type { TextChunk } from './document.types';
import * as ollamaProvider from '../ai/ollama.provider';

export function chunkText(
  text: string,
  chunkSize = 250,
  overlap = 50,
  lookAhead = 40
): TextChunk[] {
  const words = text.trim().split(/\s+/).filter(Boolean);

  const chunks: TextChunk[] = [];

  let start = 0;
  let index = 0;

  while (start < words.length) {
    // Initial end
    let end = Math.min(start + chunkSize, words.length);

    for (let i = end; i < Math.min(end + lookAhead, words.length); i++) {
      const word = words[i]!;

      if (/[.!?]["')\]]?$/.test(word)) {
        end = i + 1;
        break;
      }
    }

    // If no sentence end found,
    // we'll simply stop at chunkSize.

    chunks.push({
      index,
      content: words.slice(start, end).join(' '),
    });

    // Last chunk
    if (end >= words.length) {
      break;
    }

    // Move start with overlap
    start = Math.max(end - overlap, 0);

    index++;
  }

  return chunks;
}

export function cleanText(text: string): string {
  return (
    text
      // Normalize Windows line endings
      .replace(/\r\n/g, '\n')

      // Replace tabs with spaces
      .replace(/\t/g, ' ')

      // Collapse multiple spaces into one
      .replace(/[ ]{2,}/g, ' ')

      // Collapse multiple blank lines
      .replace(/\n{2,}/g, '\n')

      // Trim leading/trailing whitespace
      .trim()
  );
}

export const process = async (id: string) => {
  try {
    const document = await documentService.getDocument(id);

    if (!document) {
      throw new Error('Document not found');
    }

    const parser = new PDFParse({
      url: document.storagePath,
    });

    const result = await parser.getText();

    const cleanedText = cleanText(result.text);

    const chunks = chunkText(cleanedText);

    await documentService.saveChunks(document.id, chunks);

    for (const chunk of chunks) {
      const embeddingResponse = await ollamaProvider.generateEmbedding(
        chunk.content
      );

      const vectorString = `[${embeddingResponse.join(',')}]`;

      await documentService.saveEmbeddings(document.id, vectorString);
    }

    await documentService.updateDocumentStatus(document.id, 'READY');
  } catch (error) {
    await documentService.updateDocumentStatus(id, 'FAILED');

    throw error;
  }
};
