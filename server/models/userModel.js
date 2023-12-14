const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  host: { type: String },
  port: { type: String },
  redisPassword: { type: String },
});

// ====== BCRYPT ENCRYPTION ======
// Password encryption using Bcrypt
userSchema.pre('save', async function () {
  try {
    //isModified will return true if you are changing the password
    //i.e. if user sets for the first time (or resets password)
    if (!this.isModified('password')) return;

    const hash = await bcrypt.hash(this.password, SALT_WORK_FACTOR);
    this.password = hash;
    return;
  } catch (err) {
    return console.log(err);
  }
});

// comparePassword method on the user schema to check if the provided Password matches the hashed Password
userSchema.methods.comparePassword = function (providedPassword) {
  const isMatch = bcrypt.compare(providedPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', userSchema);
