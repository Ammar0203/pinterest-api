const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pin_id: {
    type: Schema.Types.ObjectId,
    ref: 'Pin',
    required: true,
  },
  content: {
    type: String,
    required: true,
    maxLength: 400,
    minLength: 1,
  }
}, {
  timestamps: true
})

commentSchema.statics.paginate = async function ({
  limit = 20,
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

const Comment = model('Comment', commentSchema)

module.exports = Comment