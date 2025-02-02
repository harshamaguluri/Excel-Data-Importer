import express from 'express';
import multer from 'multer';
import { handleFileUpload, handleDataImport } from '../controllers/uploadController';

const router = express.Router();

// Use Multer to store file in memory
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // 2 MB limit
});

// POST /api/upload for file processing and validation.
router.post('/upload', upload.single('file'), handleFileUpload);

// POST /api/import for inserting valid rows into the database.
router.post('/import', handleDataImport);

export default router;
