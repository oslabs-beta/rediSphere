const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//expires after 5 min
// re-enable createdAt field for prod; consider what best practices recommend for time limit
// sessionID stored on cookie
const sessionSchema = new Schema({
  cookieId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  // createdAt: { type: Date, expires: 300, default: Date.now },
});

module.exports = mongoose.model('Session', sessionSchema);
