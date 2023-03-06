import express from 'express';
import 'express-async-errors';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import { config } from './config.js';
import { sequelize } from './db/database.js';
import mapRouter from './router/map.js';
import authRouter from './router/auth.js';
import partyRouter from './router/party.js';
import chatRouter from './router/chat.js';
import { initSocket } from './connection/socket.js';
const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors('*'));
app.use(morgan('tiny'));

app.use('/map', mapRouter);
app.use('/auth', authRouter);
app.use('/party', partyRouter);
app.use('/chat', chatRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

app.use((error, req, res, next) => {
  console.log(error);
  res.sendStatus(500);
});

sequelize
  .sync()
  .then((client) => {
    const server = app.listen(config.port, () => {
      console.log(`Server is started... ${new Date()}`);
    });
    initSocket(server);
  })
  .catch(console.log);
