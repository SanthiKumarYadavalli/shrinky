import mongoose from 'mongoose';

const URLSchema = new mongoose.Schema({
  originalURL: {
    type: String,
    required: true
  },
  shortCode: {
    type: String,
    required: true,
    unique: true
  },
  customAlias: {
    type: String,
    default: null,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  expiresAt: {
    type: Date,
    default: null
  },
  totalClicks: {
    type: Number,
    default: 0
  },
}, { timestamps: true });

URLSchema.index({ userId: 1 });

const Url = mongoose.model("Url", URLSchema);
export default Url;
