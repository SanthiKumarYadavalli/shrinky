import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  urlId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Url',
    required: true
  },
  ipAddress: {
    type: String
  },
  device: {
    type: String
  },
  browser: {
    type: String
  },
  operatingSystem: {
    type: String
  },
}, { timestamps: true });

const Click = mongoose.model("Click", clickSchema);
export default Click;
