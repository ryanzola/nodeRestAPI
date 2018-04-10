import { Router } from 'express';
import checkAuth from '../middleware/check-auth';
import UserController from '../controllers/user';

const router = Router();

router.post('/signup', UserController.user_signup);
router.post('/login', UserController.user_login);
router.delete('/:userId', checkAuth, UserController.user_delete);

export default router;
