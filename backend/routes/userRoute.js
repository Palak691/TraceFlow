import express from 'express';
import { cloudinary, storage } from '../config/Cloudinary.js';
import multer from 'multer';
import { getUserAndProfile, login, register, updateUserProfileData, uploadProfilePicture } from '../controllers/userController.js';
import { wrapAsync } from '../utlis/wrapAsync.js';
import { validateUser } from '../middleware/authMiddleware.js';
const router = express.Router();
const upload = multer({storage : storage});

router.route('/register').post(wrapAsync(register));
router.route('/login').post(wrapAsync(login));
router.route('/profile-picture').post(validateUser, upload.single('profilePicture'), wrapAsync(uploadProfilePicture));
router.route('/me').get(validateUser, wrapAsync(getUserAndProfile));
router.route('/me').patch(validateUser, wrapAsync(updateUserProfileData));


export default router;