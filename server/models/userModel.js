const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 20;
const bcrypt = require('bcryptjs');

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// // ====== BCRYPT ENCRYPTION ======
// // Password encryption using Bcrypt
// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   //   console.log("about to get salty");
//   const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
//   const hashedPassword = await bcrypt.hash(this.password, salt);
//   this.password = hashedPassword;
// });

// // Gives us a comparePassword method on the user to check if the provided Password matches the database Password
// userSchema.methods.comparePassword = async function (providedPassword) {
//   const isMatch = await bcrypt.compare(providedPassword, this.password);
//   return isMatch;
// };

module.exports = mongoose.model('User', userSchema);
