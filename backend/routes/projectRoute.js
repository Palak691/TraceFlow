import express from 'express';
import { cloudinary, storage } from '../config/Cloudinary.js';
import { wrapAsync } from '../utlis/wrapAsync.js';
import { createProject, deleteProject, getMyProjects, getProjectById, joinProject, transferOwnership } from '../controllers/projectController.js';
import { validateUser } from '../middleware/authMiddleware.js';
import { checkProjectManager } from '../middleware/checkProjectManager.js';
import { checkProjectMember } from '../middleware/checkProjectMember.js';

const router = express.Router();



router.route('/').post(validateUser,wrapAsync(createProject));
router.route('/join').post(validateUser,wrapAsync(joinProject));
router.route('/mine').get(validateUser,wrapAsync(getMyProjects));
router.route('/:projectId').get(validateUser,checkProjectMember,wrapAsync(getProjectById));
router.route('/:projectId').delete(validateUser,checkProjectManager,wrapAsync(deleteProject));
router.route('/:projectId/transfer').post(validateUser,checkProjectManager,wrapAsync(transferOwnership));



export default router;