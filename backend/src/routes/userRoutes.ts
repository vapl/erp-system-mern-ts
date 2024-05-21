import express from 'express';
import * as userController from "../controllers/userController";
import { requiresAuth } from '../middleware/auth';

const router = express.Router();

router.get('/', requiresAuth, userController.getAuthenticatedUser);

router.get('/allUsers', userController.getUsers);

router.post('/signup', userController.signUp);

router.post('/login', userController.login);

router.post('/logout', userController.logout);

router.put('/userUpdate', userController.handleFileUpload, userController.updateUser);

router.put('/:id', userController.handleFileUpload, userController.updateUserByAdmin);

router.delete('/delete', userController.deleteFile);

router.delete('/deleteUser', userController.deleteUser);

export default router;