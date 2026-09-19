import express from 'express';
import { cloudinary, storage } from '../config/Cloudinary.js';
import multer from 'multer';
import { wrapAsync } from '../utlis/wrapAsync.js';
import { validateUser } from '../middleware/authMiddleware.js';
import { createConversation, createConversationFromImage, getConversationsByProject } from '../controllers/conversationController.js';
import { checkProjectMember } from '../middleware/checkProjectMember.js';

const router = express.Router();
const upload = multer({storage : storage});


router.route('/').post(validateUser,checkProjectMember,wrapAsync(createConversation));
router.route('/upload').post(validateUser, upload.single('image'),checkProjectMember, wrapAsync(createConversationFromImage));
router.route('/:projectId').get(validateUser,checkProjectMember,wrapAsync(getConversationsByProject));

//deleteConversatonChat
//delete chat req to admin
export default router;