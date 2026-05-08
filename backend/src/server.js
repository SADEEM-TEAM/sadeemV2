require('dotenv').config();

// Polyfill globalThis.crypto for Node < 19 (mongodb driver + bcryptjs need it)
if (typeof globalThis.crypto === 'undefined') {
  globalThis.crypto = require('node:crypto').webcrypto;
}

const mongoose = require('mongoose');
const app = require('./app');
const { logger } = require('./utils/logger');

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sadeen';

async function start() {
  try {
    await mongoose.connect(MONGO_URI);
    logger.info('mongo: connected');
    app.listen(PORT, () => logger.info(`api: listening on :${PORT}`));
  } catch (err) {
    logger.error('mongo: connection failed', err);
    process.exit(1);
  }
}

start();
