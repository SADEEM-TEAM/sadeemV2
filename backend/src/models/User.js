const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const OnboardingSchema = new mongoose.Schema(
  {
    completed: { type: Boolean, default: false },
    age: Number,
    gradeLabel: String,
    establishment: String,
    levelByTopic: { type: Map, of: String },
    dailyGoalXp: { type: Number, default: 30 }
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['student', 'teacher', 'parent', 'admin'], default: 'student' },
    mascotPref: { type: String, enum: ['blue', 'pink'], default: 'blue' },
    xp: { type: Number, default: 0 },
    hearts: { type: Number, default: 5 },
    lastHeartLossAt: { type: Date },
    streak: { type: Number, default: 0 },
    streakLastDay: { type: String },
    onboarding: { type: OnboardingSchema, default: () => ({}) },
    orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Organization' },
    classIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Class' }],
    achievements: [{ type: String }]
  },
  { timestamps: true }
);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

UserSchema.methods.toPublic = function () {
  const o = this.toObject();
  delete o.password;
  return o;
};

module.exports = mongoose.model('User', UserSchema);
