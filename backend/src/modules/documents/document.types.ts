export interface UploadDocumentInput {
  title: string;
  userId: string;
  file: Express.Multer.File;
}

export interface TextChunk {
  index: number;
  content: string;
}
