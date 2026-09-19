import express from 'express';
import { cloudinary, storage } from '../config/Cloudinary.js';
import multer from 'multer';
import { wrapAsync } from '../utlis/wrapAsync.js';
import { validateUser } from '../middleware/authMiddleware.js';
import { approveConversationDeletion, createConversation, createConversationFromImage, deleteConversation, getConversationsByProject, rejectConversationDeletion, reqConversationDeletion } from '../controllers/conversationController.js';
import { checkProjectMember } from '../middleware/checkProjectMember.js';
import { checkProjectManager } from '../middleware/checkProjectManager.js';


const router = express.Router();
const upload = multer({storage : storage});


router.route('/').post(validateUser,checkProjectMember,wrapAsync(createConversation));
router.route('/upload').post(validateUser, upload.single('image'),checkProjectMember, wrapAsync(createConversationFromImage));
router.route('/:projectId').get(validateUser,checkProjectMember,wrapAsync(getConversationsByProject));
router.route('/:projectId/:id').delete(validateUser,checkProjectManager,wrapAsync(deleteConversation));
router.route('/:projectId/:id/request-deletion').post(validateUser,checkProjectMember,wrapAsync(reqConversationDeletion));
router.route('/:projectId/:id/approve-deletion').post(validateUser,checkProjectManager,wrapAsync(approveConversationDeletion));
router.route('/:projectId/:id/reject-deletion').post(validateUser,checkProjectManager,wrapAsync(rejectConversationDeletion));


export default router;