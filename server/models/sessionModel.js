const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//expires after 5 min
const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  createdAt: { type: Date, expires: 300, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
