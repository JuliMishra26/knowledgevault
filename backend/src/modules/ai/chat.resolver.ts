import * as chatService from '../chat/chat.service';

export const chatResolvers = {
  Mutation: {
    askQuestion: async (
      _: unknown,
      { input }: { input: { question: string } }
    ) => {
      return await chatService.askQuestion(input.question);
    },
  },
};
