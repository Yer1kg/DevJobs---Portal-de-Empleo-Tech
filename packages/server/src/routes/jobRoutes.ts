import { Router } from 'express';
import { getJobs, createJob, updateJob } from '../controller/jobController.js';

const router = Router();

router.get('/', getJobs);
router.post('/', createJob);
router.put('/:id', updateJob);

export default router;