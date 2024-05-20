import mongoose from 'mongoose';
const analyticsSchema = mongoose.Schema(
  {
    codingActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingActivity',
    },
    time: [{
      type: Number,
    }],
    totalDurationInSeconds: {
      type: Number,
    },
    ip: {
      type: String,
    },
    ipinfo: {
      // ip: { type: String },
      city: { type: String },
      region: { type: String },
      country: { type: String },
      loc: { type: String },
      org: { type: String },
      postal: { type: String },
      timezone: { type: String },
    },
    uid: {
      type: String,
    },
    browser: {
      type: String,
    },
    device: {
      type: String,
    },
    screenWidth: {
      type: Number,
    },
    screenHeight: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);
const virtual = analyticsSchema.virtual('aspectRatio');
virtual.get(function (value, virtual, doc) {
  if(!this.screenWidth || !this.screenHeight) return null;
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }
  const divisor = gcd(this.screenWidth, this.screenHeight);
  const aspectRatioWidth = this.screenWidth / divisor;
  const aspectRatioHeight = this.screenHeight / divisor;

  return `${aspectRatioWidth}:${aspectRatioHeight}`
});
const Analytics =
  mongoose.models.Analytics ||
  mongoose.model('Analytics', analyticsSchema);
export default Analytics;
