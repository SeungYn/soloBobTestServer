import express from 'express';
import 'express-async-errors';
import * as mapController from '../controller/map.js';

const router = express.Router();

router.get('/:location', packagesController.getBylocation);

export default router;
