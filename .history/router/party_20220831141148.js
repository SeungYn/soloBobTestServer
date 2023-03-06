import express from 'express';
import 'express-async-errors';
import * as partyController from '../controller/party.js';
import { isAuth } from '../middleware/auth.js';

const router = express.Router();

//유저가 소속된 파티 가져오기
router.get('/myparty', isAuth, partyController.getMyParty);

router.get('/:restaurantId', partyController.getPartyByRestaurantId);

//router.post('/makeParty:resId', partyController.makeParty);

//파티참가
router.post('/joinParty/:partyId', isAuth, partyController.joinParty);
//파티만들기
router.post('/makeParty2/:resId', isAuth, partyController.makeParty2);
//파티 탈퇴
router.post('/outParty/:partyId', isAuth, partyController.outParty);
export default router;
