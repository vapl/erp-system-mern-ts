import express from 'express';
import * as userController from "../controllers/userController";
import { requiresAuth } from '../middleware/auth';

const router = express.Router();

// router.get('/:userId', userController.getNote)

router.get('/', requiresAuth, userController.getAuthenticatedUser);

router.get('/allUsers', userController.getUsers);

router.post('/signup', userController.signUp);

router.post('/login', userController.login);

router.post('/logout', userController.logout);
// router.patch('/:userId', userController.updateNote)

export default router;