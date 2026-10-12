import { Router } from 'express';
import { searchCandidates, listJobs } from '../controllers/candidateController.js';

const router = Router();
router.get('/candidates', searchCandidates);
router.get('/jobs', listJobs);

export default router;
