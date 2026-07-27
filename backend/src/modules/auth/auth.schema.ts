export const authTypeDefs = `#graphql

type User {
    id: ID!
    name: String!
    email: String!
}
    
input RegisterInput {
    name: String!
    email: String!
    password: String!
}

extend type Query {
  users: [User!]!
}

extend type Query {
  me: User
}

type Mutation {
    register(input: RegisterInput): User!
}

input LoginInput {
  email: String!
  password: String!
}

type AuthPayload {
  token: String!
  user: User!
}

extend type Mutation {
  login(input: LoginInput!): AuthPayload!
}
`;
