import express from 'express';
import { cloudinary, storage } from '../config/Cloudinary.js';
import { wrapAsync } from '../utlis/wrapAsync.js';
import { validateUser } from '../middleware/authMiddleware.js';
import { getDecisionsByProject } from '../controllers/decisionController.js';
import { checkProjectMember } from '../middleware/checkProjectMember.js';
import { search } from '../controllers/searchController.js';

const router = express.Router();



router.route('/:projectId').get(validateUser, checkProjectMember, wrapAsync(search));




export default router;