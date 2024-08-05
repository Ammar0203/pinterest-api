const { Schema, model } = require('mongoose');

const pinSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxLength: 64,
    minLength: 1,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxLength: 1000,
    minLength: 1,
  },
  name: {
    type: String,
    unique: true,
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
  likes: {
    type: Number,
    default: 0,
  },
  comments: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

pinSchema.statics.paginate = async function ({
  limit = 8,
  page = 1,
  sort = -1,
  where = {},
}) {
  const skip = limit * (page - 1);
  const items = await this.find({ ...where, parent: null })
    .limit(limit)
    .skip(skip)
    .sort({ createdAt: sort })
    .populate("user", "-password");

  const pages = Math.ceil(
    (await this.countDocuments({ ...where })) / limit
  );

  return {
    items,
    pages,
  };
};

pinSchema.statics.getRandomSample = async function({excludeIds = [], sampleSize = 20}) {
  try {
    const pipeline = [
      { $match: { _id: { $nin: excludeIds } } },
      { $sample: { size: sampleSize } }
    ];
    
    const randomSample = await Pin.aggregate(pipeline);
    return randomSample;
  } catch (err) {
    console.error(err);
    return [];
  }
}

const Pin = model("Pin", pinSchema);

module.exports = Pin;