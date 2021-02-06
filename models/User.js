const mongoose = require("mongoose");

const User = mongoose.model("User", {
  email: { unique: true, required: true, type: String },
  username: { required: true, type: String },
  favorites: {
    characters: Array,
    comics: Array,
  },
  token: String,
  hash: String,
  salt: String,
});

module.exports = User;
