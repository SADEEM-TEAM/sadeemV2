require('dotenv').config();
const mongoose = require('mongoose');
const { logger } = require('../utils/logger');
const Course = require('../models/Course');
const Lesson = require('../models/Lesson');
const MiniGame = require('../models/MiniGame');
const User = require('../models/User');

const COURSES = require('./data/courses');
const HISTORY = require('./data/history');
const MATH = require('./data/math');
const CODING = require('./data/coding');

async function run() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sadeen');
  logger.info('seed: connected');

  await Promise.all([
    Course.deleteMany({}),
    Lesson.deleteMany({}),
    MiniGame.deleteMany({})
  ]);

  const courses = await Course.insertMany(COURSES);
  const courseBySlug = Object.fromEntries(courses.map((c) => [c.slug, c]));

  for (const dataset of [HISTORY, MATH, CODING]) {
    const course = courseBySlug[dataset.courseSlug];
    if (!course) continue;
    for (let i = 0; i < dataset.lessons.length; i++) {
      const lessonSpec = dataset.lessons[i];
      const lesson = await Lesson.create({
        courseId: course._id,
        order: i,
        ...lessonSpec.lesson
      });
      for (let j = 0; j < lessonSpec.games.length; j++) {
        const g = lessonSpec.games[j];
        await MiniGame.create({ lessonId: lesson._id, order: j, ...g });
      }
    }
  }

  const demoEmail = 'demo@sadeen.dz';
  await User.deleteOne({ email: demoEmail });
  await User.create({
    username: 'كريم',
    email: demoEmail,
    password: 'demo1234',
    role: 'student',
    mascotPref: 'blue',
    onboarding: {
      completed: true,
      age: 12,
      gradeLabel: 'متوسط 1',
      establishment: 'متوسطة الأمل',
      dailyGoalXp: 30
    }
  });

  logger.info('seed: done');
  await mongoose.disconnect();
}

run().catch((err) => {
  logger.error(err);
  process.exit(1);
});
