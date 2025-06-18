// 📁 src/routes/leadRoutes.js
import express from 'express';
import { createLead } from '../controllers/leadController.js';

const router = express.Router();

// POST /api/leads
router.post('/', createLead);

export default router;
