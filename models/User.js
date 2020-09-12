const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  admin: {
    type: Boolean,
    default: false
  },
  password: {
    type: String,
    required: true
  },
  password2: {
    type: String,
    required: true
  },
  siteler: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Site",
  }],
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
