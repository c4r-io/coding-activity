import mongoose from 'mongoose';
const analyticsSchema = mongoose.Schema(
  {
    codingActivity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingActivity',
    },
    codeExecutorIssueList: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "PythonExecutorIssueList",
      required: false,
      default: null,
    }],
    // time: [{
    //   type: Number,
    // }],
    sessionStartTime: {
      type: Number,
    },
    sessionEndTime: {
      type: Number,
    },
    sessionDuration: {
      type: Number,
    },
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
    // totalDurationInSeconds: {
    //   type: Number,
    // },
    ip: {
      type: String,
    },
    region: { type: String },
    country: { type: String },
    loc: { type: String },
    latitude: { type: Number },
    longitude: { type: Number },
    org: { type: String },
    asn: { type: String },
    asnName: { type: String },
    postal: { type: String },
    timezone: { type: String },
    continent: { type: String },
    city: { type: String },
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
    aspectRatio: {
      type: Number,
    },
    submission1: {
      issue:{type: String},
      attachment:{type: Object},
    },
    submission2: {
      issue:{type: String},
      attachment:{type: Object},
    },   
    submission3: {
      issue:{type: String},
      attachment:{type: Object},
    },  
    submissionList: [{
      issue:{type: String},
      attachment:{type: Object},
    }],   
    error1: {
      errorCode:{
        type: Number,
      },
      description:{
        type: String,
      }
    },
    error2: {
      errorCode:{
        type: Number,
      },
      description:{
        type: String,
      }
    },   
    error3: {
      errorCode:{
        type: Number,
      },
      description:{
        type: String,
      }
    },  
    errorList: [{
      errorCode:{
        type: Number,
      },
      description:{
        type: String,
      }
    }], 
    featureEngineeredData: {
      type: Object,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);
analyticsSchema.remove(['analyticsById.ipinfo', 'analyticsById.sessionTime']);
// const aspectRatio = analyticsSchema.virtual('aspectRatio');
// aspectRatio.get(function (value, virtual, doc) {
//   if (!this.screenWidth || !this.screenHeight) return null;
//   function gcd(a, b) {
//     return b === 0 ? a : gcd(b, a % b);
//   }
//   const divisor = gcd(this.screenWidth, this.screenHeight);
//   const aspectRatioWidth = this.screenWidth / divisor;
//   const aspectRatioHeight = this.screenHeight / divisor;

//   return `${(this.screenWidth / this.screenHeight).toFixed(2)}`
// });
analyticsSchema.pre('save', function (next) {
  if (this.screenWidth && this.screenHeight) {
    this.aspectRatio = (this.screenWidth / this.screenHeight).toFixed(2);
  }
  if(this.sessionStartTime && this.sessionEndTime){
    this.sessionDuration = (this.sessionEndTime - this.sessionStartTime)/1000;
  }
  next();
}

);
const Analytics =
  mongoose.models.Analytics ||
  mongoose.model('Analytics', analyticsSchema);
export default Analytics;
