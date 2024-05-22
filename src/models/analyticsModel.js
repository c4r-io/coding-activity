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
    sessionTime: {
      start: {
        type: Number,
      },
      end: {
        type: Number,
      },
      total: {
        type: Number,
      },
    },
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
      latitude: { type: Number },
      longitude: { type: Number },
      org: { type: String },
      asn: {
        asn: { type: String },
        name: { type: String },
      },
      postal: { type: String },
      timezone: { 
        tz: { type: String },
        continent: { type: String },
        city: { type: String },
       },
      continent: { type: String },
      continentCity: { type: String },
    },
    uid: {
      type: String,
    },
    browser: {
      type: String,
    },
    browserVersion: {
      type: String,
    },
    device: {
      type: String,
    },
    deviceVersion: {
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
const aspectRatio = analyticsSchema.virtual('aspectRatio');
aspectRatio.get(function (value, virtual, doc) {
  if (!this.screenWidth || !this.screenHeight) return null;
  function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
  }
  const divisor = gcd(this.screenWidth, this.screenHeight);
  const aspectRatioWidth = this.screenWidth / divisor;
  const aspectRatioHeight = this.screenHeight / divisor;

  return `${(this.screenWidth / this.screenHeight).toFixed(2)}`
});

const Analytics =
  mongoose.models.Analytics ||
  mongoose.model('Analytics', analyticsSchema);
export default Analytics;
