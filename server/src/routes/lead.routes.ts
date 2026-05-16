import { Router } from 'express';
import {
  getLeads,
  getLead,
  createLead,
  updateLead,
  deleteLead,
  exportCSV,
} from '../controllers/lead.controller';
import {
  authMiddleware,
  adminMiddleware,
} from '../middleware/auth.middleware';

const router = Router();

// All routes are protected
router.use(authMiddleware);

router.get('/export/csv', exportCSV);
router.get('/', getLeads);
router.get('/:id', getLead);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', adminMiddleware, deleteLead);

export default router;