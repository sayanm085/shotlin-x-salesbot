// Lead routes
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import * as leadController from '../controllers/leadController.js';
import validateLead from '../middleware/validateLead.js';

// For __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../../uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    // Accept only CSV files
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
  limits: { fileSize: 1024 * 1024 * 5 } // 5MB max
});

// Routes
router.route('/')
  .get(leadController.getLeads)
  .post(validateLead, leadController.createLead);

router.route('/:id')
  .get(leadController.getLeadById)
  .put(validateLead, leadController.updateLead)
  .delete(leadController.deleteLead);

router.post('/import', upload.single('file'), leadController.importLeads);
router.put('/:id/toggle-ai', leadController.toggleAI);

export default router;