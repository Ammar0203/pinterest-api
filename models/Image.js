const { Schema, model } = require('mongoose');

const imageSchema = new Schema({
  pin: {
    type: Schema.Types.ObjectId,
    ref: "Pin",
    required: true
  },
  image: {
    type: String,
    required: true,
    trim: true,
  },
  width: {
    type: Number,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
}, {
  timestamps: true,
});

const Image = model("Image", imageSchema);

module.exports = Image;