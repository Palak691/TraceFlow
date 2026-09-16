import express from 'express';
import { cloudinary, storage } from '../config/Cloudinary.js';
import { wrapAsync } from '../utlis/wrapAsync.js';
import { validateUser } from '../middleware/authMiddleware.js';
import { deleteTask, flagTaskForReview, getTasksByProject, resolveFlag, updatetask } from '../controllers/taskController.js';
import { checkProjectMember } from '../middleware/checkProjectMember.js';

const router = express.Router();



router.route('/:projectId').get(validateUser,checkProjectMember,wrapAsync(getTasksByProject));
router.route('/:taskId').patch(validateUser,wrapAsync(updatetask));
router.route('/:taskId').delete(validateUser,wrapAsync(deleteTask));
router.route('/:taskId/flag').patch(validateUser,wrapAsync(flagTaskForReview));
router.route('/:taskId/resolve-flag').patch(validateUser,wrapAsync(resolveFlag));


export default router;