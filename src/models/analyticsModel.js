import mongoose from 'mongoose';
const analyticsSchema = mongoose.Schema(
  {
    codingActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingActivity',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    time: [{
      type: Number,
    }],
    totalDurationInSeconds: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
);
const Analytics =
  mongoose.models.Analytics ||
  mongoose.model('Analytics', analyticsSchema);
export default Analytics;
