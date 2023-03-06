import express from 'express';
import 'express-async-errors';
import * as authController from '../controller/auth.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', authController.login);

//파티 준비
router.post('/partyReady', isAuth, authController.partyReady);

//파티 준비 해제
router.get('/partyUnReady', isAuth, authController.partyUnReady);

//유저정보가져오기
router.get('/info', isAuth, authController.getMyInfo);

//me
router.get('/me', isAuth, authController.me);
export default router;
