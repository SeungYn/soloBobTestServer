import { getSocketChatIO } from '../connection/socket.js';
import * as chatRespository from '../data/chat.js';

export async function createChatByPartyId(req, res) {
  const { partyId } = req.params;
  const { chat } = req.body;

  const re = await chatRespository.createChatByPartyId(
    partyId,
    req.nickname,
    chat
  );
  console.log(partyId);
  getSocketChatIO().of('/room').to(partyId.toString()).emit('chat', re);
  res.status(200).json(re);
}

export async function sendPositionByPartyId(req, res) {
  const { partyId } = req.params;
  const { location } = req.body;
  console.log(req.nickname, location, partyId);
  getSocketChatIO()
    .of('/room')
    .to(partyId.toString())
    .emit('pos', { nickname: req.nickname, location });
  res.status(200).json('ok');
}

export async function getChatByPartyId(req, res) {
  const { partyId } = req.params;
  const chats = await chatRespository.getChatByPartyId(partyId);

  res.status(200).json(chats);
}

//무한스크롤 채팅
export async function getChatScrollByPartyIdandPageId(req, res) {
  let { partyId, pageId } = req.params;
  pageId < 1 && pageId = 1;

  const chats = await chatRespository.getChatByPartyIdandpageId(
    partyId,
    pageId
  );

  chats.sort((a, b) => a.id - b.id);
  res.status(200).json(chats);
}
