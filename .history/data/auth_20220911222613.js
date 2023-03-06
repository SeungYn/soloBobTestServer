import SQ from 'sequelize';
import { sequelize } from '../db/database.js';
import { db } from '../db/database.js';
const DataTypes = SQ.DataTypes;

export const User = sequelize.define(
  'user',
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    loginId: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    nickname: {
      type: DataTypes.STRING(45),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    sex: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    roles: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    university: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    dept: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    sno: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    reliability: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(128),
      allowNull: false,
    },
    owner: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    currentParty: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isJoined: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    isReady: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    partyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  }
  //{ timestamps: false }
);

export async function findByUsername(loginId) {
  return User.findOne({ where: { loginId } });
}

export async function findById(id) {
  return User.findByPk(id);
}

export async function joinPartyByPartyId(partyId, userId) {
  return db //
    .execute('UPDATE users SET partyId = ? WHERE id = ?', [partyId, userId]) //
    .then(() => findById(userId));
}

export async function findUsersByPartyId(partyId) {
  return db //
    .execute('SELECT * FROM users WHERE partyId = ?', [partyId])
    .then((result) => result[0]);
}

export async function ownerRegister(userId) {
  return db.execute(
    'UPDATE users SET isJoined = true ,owner = true WHERE id = ?',
    [userId]
  );
}

export async function outParty(userId) {
  return db.execute(
    'UPDATE users SET isJoined = 0 , partyId = null, isReady = false, owner=0 WHERE id = ?',
    [userId]
  );
}

// 준비하기
export async function onReady(userId) {
  return db.execute('UPDATE users SET isReady = true WHERE id = ?', [userId]);
}

// 준비해제
export async function unReady(userId) {
  return db.execute('UPDATE users SET isReady = false WHERE id = ?', [userId]);
}
