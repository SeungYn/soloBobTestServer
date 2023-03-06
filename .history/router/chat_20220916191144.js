import express from 'express';
import 'express-async-errors';
import * as chatController from '../controller/chat.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

router.post('/:partyId', isAuth, chatController.createChatByPartyId);

//파티번호로 위치 마커 전송
router.post('/position/:partyId', isAuth, chatController.sendPositionByPartyId);

//파티번호로 채팅 내역 가져오기
router.get('/:partyId', isAuth, chatController.getChatByPartyId);
export default router;
