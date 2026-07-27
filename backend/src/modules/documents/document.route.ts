import { Router, type Request, type Response } from 'express';

import { upload } from './document.middleware';
import * as documentService from './document.services';
import { authenticate } from '../auth/auth.middleware';
import * as documentProcessor from './document.processor';

const router = Router();

router.post(
  '/documents',
  authenticate,
  upload.single('file'),
  async (req: Request, res: Response) => {
    console.log('called upalod');
    try {
      if (!req.file) {
        return res.status(400).json({
          message: 'PDF file is required',
        });
      }

      const document = await documentService.uploadDocument({
        title: req.body.title,
        file: req.file,
        userId: req.user!.id,
      });

      void documentProcessor.process(document.id);

      return res.status(201).json(document);
    } catch (error) {
      return res.status(500).json({
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }
);

export default router;
