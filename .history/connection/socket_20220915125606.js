import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config.js';

class Socket {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });

    this.room = this.io.of('/room');

    this.io.use((socket, next) => {
      console.log('auth');
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      jwt.verify(token, config.jwt.secretKey, (error, decoded) => {
        if (error) {
          return next(new Error('Authentication error'));
        }
        next();
      });
    });

    this.room.on('connection', (socket) => {
      console.log('rooms접속');
      const req = socket.request;
      const { partyId } = socket.handshake.auth;
      console.log('partyid', partyId.toString());
      socket.join(partyId);

      socket.to(partyId).emit('join', {
        message: '유저입장',
      });

      socket.on('disconnect', () => {
        console.log('room 연결 끊김');
        socket.to(partyId).emit('exit', {
          user: 'system',
          chat: `유저 퇴장하셨습니다.`,
        });
      });
    });

    this.io.on('connection', (socket) => {
      console.log('Socket client connected 소켓연결됨');
    });
  }
}

let socket;
export function initSocket(server) {
  if (!socket) {
    socket = new Socket(server);
  }
}
export function getSocketChatIO() {
  if (!socket) {
    throw new Error('Please call init first');
  }
  return socket.io;
}
