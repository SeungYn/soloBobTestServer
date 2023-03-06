import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {} from 'express-async-errors';
import * as userRepository from '../data/auth.js';
import { config } from '../config.js';

export async function login(req, res) {
  const { loginId, password } = req.body;
  console.log(loginId);
  console.log(password);
  const user = await userRepository.findByUsername(loginId);
  console.log(user);
  if (!user) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: 'Invalid user or password' });
  }
  const token = createJwtToken(user.id);
  res.status(200).json({ token, loginId: user.id });
}

export async function partyReady(req, res) {
  //사용자가 방장이면 파티 시작 아니면 준비

  await userRepository.onReady(req.userId);
  res.status(200).json({ userId: req.userId });
}

export async function partyUnReady(req, res) {
  await userRepository.unReady(req.userId);
  res.status(200).json({ userId: req.userId });
}

export async function getMyInfo(req, res) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(401).json({ message: '유저 정보가 없음' });
  }

  res.status(200).json({ partyId: user.partyId, nickname: user.nickname });
}

export async function me(req, res) {
  const user = await userRepository.findById(req.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.status(200).json({ token: req.token, loginId: user.id });
}

function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}
