import { db } from '../db/database.js';
import SQ, { Op } from 'sequelize';
import { sequelize } from '../db/database.js';
import { User } from './auth.js';
import * as userRepository from './auth.js';
import { Restaurant } from './map.js';
const DataTypes = SQ.DataTypes;
const Sequelize = SQ.Sequelize;

export const Party = sequelize.define(
  'party',
  {
    id: {
      type: DataTypes.BIGINT,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    matchingStatus: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    maximumCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    currentCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    owner: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
  },
  { timestamps: false }
);
Party.belongsTo(User);
Party.belongsTo(Restaurant);

export async function create(restaurantId, userId, title, maxNumber) {
  Party.create({ restaurantId, userId, title, maxNumber }).then(console.log);
}

export async function getPartyByRestaurantId(restaurantId) {
  return Party.findAll({
    where: {
      restaurantId,
      currentCount: { [Op.gte]: 1 },
      matchingStatus: 'NON_MATCHED',
    },
    attributes: [
      'id',
      'title',
      'createAt',
      'matchingStatus',
      'maximumCount',
      'currentCount',
      'userId',
      'restaurantId',
      [Sequelize.col('restaurant.name'), 'restaurantName'],
    ],
    include: {
      model: Restaurant,
      attributes: [],
    },
  });
}
/* 
  음식점id로 파티만들기
*/
export async function createPartyByRestaurantId(
  userId,
  resId,
  title,
  maximumCount,
  nickname
) {
  return db
    .execute(
      'INSERT INTO parties (title, createAt, matchingStatus, maximumCount, currentCount, userId, restaurantId, owner) VALUES(?,?,?,?,?,?,?,?)',
      [
        title,
        new Date(),
        'NON_MATCHED',
        maximumCount,
        1,
        userId,
        resId,
        nickname,
      ]
    )
    .then((result) => {
      userRepository.ownerRegister(userId);
      return getPartyByPartyId(result[0].insertId);
    });
}
//파티 탈퇴
export async function decreaseCountByPartyId(partyId) {
  return db.execute(
    'UPDATE parties SET currentCount = currentCount - 1 WHERE id = ?',
    [partyId]
  );
}
//파티 인원수 증가
export async function increaseCountByPartyId(partyId) {
  return db.execute(
    'UPDATE parties SET currentCount = currentCount + 1 WHERE id = ?',
    [partyId]
  );
}

//파티원 현재 ,최대 인원수 가져오기
export async function currentMaxCountByPartyId(partyId) {
  return db
    .execute('SELECT currentCount, maximumCount FROM parties WHERE id = ?', [
      partyId,
    ])
    .then((result) => result[0][0]);
}

export async function getPartyByPartyId(partyId) {
  return db
    .execute('SELECT * FROM parties WHERE id = ?', [partyId]) //
    .then((result) => {
      return result[0][0];
    });
}

//파티시작
export async function startPartyByPartyId(partyId) {
  return db
    .execute(`UPDATE parties SET matchingStatus = ? WHERE id = ?`, [
      'START',
      partyId,
    ])
    .then((res) => res);
}

function test() {
  return db.execute('SELECT createAt FROM parties').then(console.log);
}
