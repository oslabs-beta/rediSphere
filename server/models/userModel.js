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
  widgets: {
    type: Array,
    default: [
      //consider which defaults we want in prod
      ['large', 'hitmiss'],
      ['small', 'memory'],
      ['medium', 'hitmiss'],
    ],
  },
});

// ====== BCRYPT ENCRYPTION ======
// Password encryption using Bcrypt

//need to encrypt Redis Data too!
userSchema.pre('save', async function () {
  try {
    //isModified will return true if you are changing the password
    //i.e. if user sets for the first time (or resets password)
    if (!this.isModified('password')) return;
    //create a hash of the updated password
    const hash = await bcrypt.hash(this.password, SALT_WORK_FACTOR);

    //modify the request to store the hashed password instead of in plaintext
    this.password = hash;
    return;
  } catch (err) {
    return console.log(err);
  }
});

// comparePassword method on the user schema to check if the provided Password matches the hashed Password

//update to work w/RedisPassword field
userSchema.methods.comparePassword = function (providedPassword) {
  //do we need to specify the SALT_WORK_FACTOR for bcypt.compare()?
  const isMatch = bcrypt.compare(providedPassword, this.password);
  return isMatch;
};

module.exports = mongoose.model('User', userSchema);
