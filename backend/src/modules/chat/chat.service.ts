import ollama from 'ollama';
import { searchSimilarChunks } from '../ai/search.service';

export type ChatStreamEvent =
  | {
      type: 'status';
      data: string;
    }
  | {
      type: 'token';
      data: string;
    }
  | {
      type: 'done';
    };

export async function* streamAnswers(
  question: string
): AsyncGenerator<ChatStreamEvent> {
  // Stage 1
  yield {
    type: 'status',
    data: 'Searching uploaded documents...',
  };

  const chunks = await searchSimilarChunks(question);

  // Stage 2
  yield {
    type: 'status',
    data: 'Preparing context...',
  };

  const context = chunks.map((chunk) => chunk.content).join('\n\n');

  const messages = [
    {
      role: 'system' as const,
      content: `You are KnowledgeVault AI.

Answer ONLY from the provided context.

Rules:
- If the answer cannot be found in the context, reply exactly:
"I couldn't find that information in the uploaded documents."

- Do not use outside knowledge.
- Do not make up facts.
- If the context contains the answer, summarize it naturally.
- Keep the answer clear and concise.`,
    },
    {
      role: 'user' as const,
      content: `Context:
${context}

Question:
${question}`,
    },
  ];

  // Stage 3
  yield {
    type: 'status',
    data: 'Generating AI response...',
  };

  const stream = await ollama.chat({
    model: 'llama3.2',
    messages,
    stream: true,
  });

  for await (const chunk of stream) {
    if (!chunk.message.content) continue;

    yield {
      type: 'token',
      data: chunk.message.content,
    };
  }

  yield {
    type: 'done',
  };
}
