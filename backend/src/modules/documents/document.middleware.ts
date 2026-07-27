import type { Request } from 'express';
import multer, { type FileFilterCallback } from 'multer';
import path from 'path';
import fs from 'fs';

// 1. Ensure upload directory exists
const uploadDir = path.join(process.cwd(), '../uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// 2. Configure Disk Storage
const storage = multer.diskStorage({
  destination: (_: Request, file: Express.Multer.File, cb) => {
    cb(null, uploadDir);
  },
  filename: (_: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = crypto.randomUUID();
    const fileExt = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${fileExt}`);
  },
});

// 3. Define File Filter (Validation)
const fileFilter = (
  _: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  if (file.mimetype !== 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDFs are allowed!'));
  }
};

// 4. Initialize Multer Instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // Limit: 5MB
  },
});
