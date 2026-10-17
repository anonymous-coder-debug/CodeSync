const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Room name is required'],
      trim: true,
      maxlength: 60,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: {
      type: [memberSchema],
      default: [],
    },
    language: {
      type: String,
      enum: ['javascript', 'python', 'cpp', 'java'],
      default: 'javascript',
    },
    code: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

roomSchema.methods.toSummary = function toSummary() {
  return {
    roomId: this.roomId,
    name: this.name,
    owner: this.owner,
    language: this.language,
    memberCount: this.members.length,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

module.exports = mongoose.model('Room', roomSchema);
