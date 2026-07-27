export const chatTypeDefs = `#graphql
type ChatResponse {
  answer: String!
}

input AskQuestionInput {
  question: String!
}

type Mutation {
  askQuestion(input: AskQuestionInput!): ChatResponse!
}
  `;
