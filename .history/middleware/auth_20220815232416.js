import jwt from 'jsonwebtoken';
import { config } from '../config.js';
import * as userRepository from '../data/auth.js';

const AUTH_ERROR = { message: 'Authentication Error' };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!(authHeader && authHeader.startsWith('Bearer '))) {
    return res.status(401).json(AUTH_ERROR);
  }
  console.log('token');
  const token = authHeader.split(' ')[1];
  console.log(token);
  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      console.log('토큰에러');
      return res.status(401).json(AUTH_ERROR);
    }
    const user = await userRepository.findById(decoded.id);
    if (!user) {
      console.log('유저없음');
      return res.status(401).json(AUTH_ERROR);
    }
    req.userId = user.id; // req.customData
    next();
  });
};
