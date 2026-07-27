import type { Request, Response } from 'express';
import { streamAnswers } from './chat.service';

export async function streamChat(req: Request, res: Response) {
  res.set({
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
  });

  res.flushHeaders();

  try {
    for await (const event of streamAnswers(req.body.question)) {
      res.write(`event: ${event.type}\n`);

      if ('data' in event) {
        res.write(`data: ${event.data}\n\n`);
      } else {
        res.write(`data:\n\n`);
      }
    }
  } catch (error) {
    console.error(error);

    res.write(`event: error\n`);
    res.write(`data: Something went wrong.\n\n`);
    return;
  } finally {
    res.end();
  }
}
