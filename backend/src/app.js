const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const { errorHandler, notFound } = require('./middleware/error');

const authRoutes = require('./modules/auth/auth.routes');
const userRoutes = require('./modules/users/users.routes');
const courseRoutes = require('./modules/courses/courses.routes');
const lessonRoutes = require('./modules/lessons/lessons.routes');
const gameRoutes = require('./modules/games/games.routes');
const progressRoutes = require('./modules/progress/progress.routes');
const leaderboardRoutes = require('./modules/leaderboard/leaderboard.routes');
const mascotRoutes = require('./modules/mascot/mascot.routes');

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : true,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => res.json({ ok: true, ts: Date.now() }));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/mascot', mascotRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
