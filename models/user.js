const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const { isEmail } = require('validator')

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxLength: 32,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
    validate: [ isEmail, 'invalid email' ]
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  avatar: {
    type: String,
    trim: true,
    default: null,
  },
}, {
  timestamps: true,
});

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.hash(user.password, 10, function (err, hash) {
    if (err) return next(err);
    user.password = hash;
    next();
  });
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
};

userSchema.methods.toJSON = function() {
  var obj = this.toObject();
  delete obj.password;
  return obj;
}

const User = model("User", userSchema);

module.exports = User;