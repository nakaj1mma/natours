const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your name."],
    trim: true,
    minlength: [2, "A name must have at least 2 characters."],
    validate: {
      validator: function (val) {
        return validator.isAlpha(val.replace(/\s/g, ""), "en-US");
      },
      message: "Name must only contain letters.",
    },
  },
  email: {
    type: String,
    required: [true, "Please enter your email."],
    trim: true,
    lowercase: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Email is not valid. Please double-check.",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide a password."],
    minlength: [8, "Password must be at least 8 characters long."],
    validate: {
      validator: validator.isStrongPassword,
      message:
        "Your password is not strong enough. It must include uppercase, lowercase, number, and special character.",
    },
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm your password."],
    validate: {
      validator: function (val) {
        // This only works on CREATE and SAVE!!!
        return val === this.password;
      },
      message: "Passwords do not match.",
    },
    select: false,
  },
  photo: {
    type: String,
  },
  passwordChangedAt: { type: Date },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // Delete passwordConfirm field
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
