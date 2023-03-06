import { db } from '../db/database.js';

export async function createChatByPartyId(partyId, nickname, chat) {
  return db
    .execute(
      'INSERT INTO chat (room, chat, createdAt, user)  VALUES(?,?,?,?)',
      [partyId, chat, new Date(), nickname]
    )
    .then((result) => getChatById(result[0].insertId));
}

export async function getChatById(id) {
  return db
    .execute('SELECT * FROM chat WHERE id = ?', [id])
    .then((result) => result[0][0]);
}

export async function getChatByPartyId(partyId) {
  return db
    .execute('SELECT * FROM chat WHERE room = ?', [partyId])
    .then((result) => result[0]);
}

export async function getChatByPartyIdandpageId(partyId, pageId) {
  return db
    .execute('SELECT * FROM chat WHERE room = ? order by id DESC limit ?, 10', [
      partyId,
      pageId,
    ])
    .then((result) => result[0]);
}
