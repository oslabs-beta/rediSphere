const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//expires after 60 seconds
const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
  createdAt: { type: Date, expires: 60, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
