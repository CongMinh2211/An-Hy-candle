const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  provider: { type: String, default: 'local' },
  providerId: { type: String, default: '' },
  isAdmin: { type: Boolean, default: false },
  phone: { type: String, default: '' },
  addresses: [
    {
      fullName: String,
      phone: String,
      address: String,
      district: String,
      city: String,
      isDefault: { type: Boolean, default: false }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

// Password hashing before saving. OAuth users may not have a password.
userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password matching
userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
