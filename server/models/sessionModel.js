const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// sessionID stored on cookie
const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  createdAt: { type: Date, expires: 28800, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
