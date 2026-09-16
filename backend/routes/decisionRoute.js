import express from 'express';
import { cloudinary, storage } from '../config/Cloudinary.js';
import { wrapAsync } from '../utlis/wrapAsync.js';
import { validateUser } from '../middleware/authMiddleware.js';
import { getDecisionsByProject } from '../controllers/decisionController.js';
import { checkProjectMember } from '../middleware/checkProjectMember.js';

const router = express.Router();



router.route('/:projectId').get(validateUser, checkProjectMember, wrapAsync(getDecisionsByProject));




export default router;