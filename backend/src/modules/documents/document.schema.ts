export const documentTypeDefs = `#graphql 

enum DocumentStatus {
  UPLOADING
  READY
  FAILED
  PROCESSING
}

type Document {
  id: ID!
  originalFileName: String!
  storagePath: String!
  mimeType: String!
  size: Int!
  status: DocumentStatus!
  uploadedBy: User
}

extend type Query {
  documents: [Document!]!
  document(id: ID!): Document
}

`;
