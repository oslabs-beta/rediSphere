const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//expires after 10 min
const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
  createdAt: { type: Date, expires: '10m', default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
