import express from 'express';
import { cloudinary, storage } from '../config/Cloudinary.js';
import { wrapAsync } from '../utlis/wrapAsync.js';
import { validateUser } from '../middleware/authMiddleware.js';
import { deleteTask, flagTaskForReview, getTasksByProject, resolveFlag, updateTask,  } from '../controllers/taskController.js';
import { checkProjectMember } from '../middleware/checkProjectMember.js';
import { checkTaskProjectManager, checkTaskProjectMember } from '../middleware/taskAuth.js';



const router = express.Router();



router.route('/:projectId').get(validateUser,checkProjectMember,wrapAsync(getTasksByProject));
router.route('/:taskId').patch(validateUser,checkTaskProjectMember,wrapAsync(updateTask));
router.route('/:taskId').delete(validateUser,checkTaskProjectManager,wrapAsync(deleteTask));
router.route('/:taskId/flag').patch(validateUser,checkTaskProjectMember,wrapAsync(flagTaskForReview));
router.route('/:taskId/resolve-flag').patch(validateUser,checkTaskProjectManager,wrapAsync(resolveFlag));


export default router;