import connectMongoDB from '@/config/connectMongoDB.js';
import { admin, protect } from '@/authorizationMiddlewares/authMiddleware';
import Analytics from '@/models/analyticsModel';
import CodingActivity from '@/models/codingActivityModel';
import { getClientIp } from 'request-ip';
import axios from 'axios';
// @desc Get all videoClipLists
// @route GET api/videoClipLists
// @acess Privet
const defaultAnalytics = [
  { name: "Linux", value: 20 },
  { name: "Windows", value: 30 },
  { name: "Mac os", value: 50 },
];
function countIdenticalValues(array, key) {
  const countMap = {};

  array.forEach(item => {
    const keys = key.split('.');
    let value = item;
    for (const k of keys) {
      value = value[k];
    }

    if (value !== undefined) {
      if (!countMap[value]) {
        countMap[value] = 1;
      } else {
        countMap[value]++;
      }
    }
  });

  const result = [];
  for (const value in countMap) {
    result.push({ name: value, value: countMap[value] });
  }

  return result;
}
function calculateAnalytics(array, key, key2) {
  const analytics = {};

  array.forEach(item => {
    const keys = key.split('.');
    const value1 = keys.reduce((acc, cur) => acc && acc[cur], item);

    const keys2 = key2.split('.');
    const value2 = keys2.reduce((acc, cur) => acc && acc[cur], item);

    if (value1 !== undefined && value2 !== undefined) {
      // const label = `${value1}-${value2}`;
      const label = `${value2}`;
      if (analytics[label]) {
        analytics[label]++;
      } else {
        analytics[label] = 1;
      }
    }
  });

  const result = Object.entries(analytics).map(([label, value]) => ({
    name: label,
    label,
    value
  }));

  return result;
}
function calculateHistogramBins(data, binSize) {
  // Determine the minimum and maximum values in the dataset
  const values = data.map(item => item.value);
  const minValue = Math.min(...values);
  const maxValue = Math.max(...values);

  // Calculate the number of bins needed
  const binCount = Math.ceil((maxValue - minValue + 1) / binSize);

  // Initialize bins
  const bins = Array(binCount).fill(0).map((_, index) => ({
    label: `${minValue + index * binSize} - ${minValue + (index + 1) * binSize - 1}`,
    value: 0
  }));

  // Distribute the values into bins
  data.forEach(item => {
    const binIndex = Math.floor((item.value - minValue) / binSize);
    bins[binIndex].value++;
  });

  return bins;
}

function findMaxRepeatedString(arr) {
  // Create an object to store the count of each string
  const countMap = {};

  // Iterate over the array and count occurrences of each string
  arr.forEach(str => {
    countMap[str] = (countMap[str] || 0) + 1;
  });

  // Find the string with maximum count
  let maxCount = 0;
  let maxString = null;

  for (const str in countMap) {
    if (countMap[str] > maxCount) {
      maxCount = countMap[str];
      maxString = str;
    }
  }

  // Return the maximum repeated string and its count
  return { string: maxString, count: maxCount };
}
function calculateAnalyticsPieChart(array, key, key2) {
  const analytics = {};
  const analyticsArray = [];
  let analyticsArrayKeys = [];

  array.forEach(item => {
    const keys = key.split('.');
    const value1 = keys.reduce((acc, cur) => acc && acc[cur], item);

    const keys2 = key2.split('.');
    const value2 = keys2.reduce((acc, cur) => acc && acc[cur], item);

    if (value1 !== undefined && value2 !== undefined) {
      // const label = `${value1}-${value2}`;
      const label = `${value2}`;
      analyticsArray.push({
        label: label,
        value: value1
      })
      analyticsArrayKeys.push(label)
    }
  });
  analyticsArrayKeys = Array.from(new Set(analyticsArrayKeys))
  analyticsArrayKeys.forEach((key) => {
    const value = analyticsArray.filter((item) => item.label === key).map((item) => item.value);
    // console.log(key, value)
    const maxRepeated = findMaxRepeatedString(value)
    analytics[`${key}-${maxRepeated.string}`] = value.length
  })
  // console.log(analyticsArrayKeys, analyticsArray)
  // console.log(analytics)

  const result = Object.entries(analytics).map(([label, value]) => ({
    name: label,
    label,
    value
  }));
  return result;
}
function calculateAnalyticsHistogram(array, key, key2, bins) {
  const analytics = {};
  const analyticsMaxList = [];
  const analyticsReploted = []
  const analyticsArray = [];
  let analyticsArrayKeys = [];

  array.forEach(item => {
    const keys = key.split('.');
    const value1 = keys.reduce((acc, cur) => acc && acc[cur], item);

    const keys2 = key2.split('.');
    const value2 = keys2.reduce((acc, cur) => acc && acc[cur], item);

    if (value1 !== undefined && value2 !== undefined) {
      // const label = `${value1}-${value2}`;
      const label = `${value2}`;
      analyticsArray.push({
        label: label,
        value: value1
      })
      analyticsArrayKeys.push(label)
    }
  });
  analyticsArrayKeys = Array.from(new Set(analyticsArrayKeys))
  const allNumbers = []
  const copyAnalyticsArray = analyticsArray.map(e => e)
  analyticsArrayKeys.forEach((key) => {
    const value = analyticsArray.filter((item) => item.label === key).map((item) => item.value);
    // console.log(key,Math.max(...value))
    const maxValue = Math.max(...value)
    analyticsMaxList.push(maxValue)
    for (let index in copyAnalyticsArray) {
      if (copyAnalyticsArray[index].label == key) {
        copyAnalyticsArray[index] = { ...copyAnalyticsArray[index], value: maxValue }
      }
    }
  })
  const sortedValuesOfAnalyticsArray = copyAnalyticsArray.map(e => e.value).sort((a, b) => a - b)
  // console.log(analyticsArrayKeys, sortedValuesOfAnalyticsArray)
  // console.log(analyticsMaxList)

  const range = Math.max(...analyticsMaxList) - Math.min(...analyticsMaxList)
  const binSize = range / bins

  // console.log(range, binSize, bins)
  let minNumber = sortedValuesOfAnalyticsArray[0];
  let maxNumber = minNumber + binSize;
  let bucketCount = 1;
  let bucketInnerItemCount = 0;
  let midPoint = minNumber + binSize / 2;
  // console.log(midPoint, maxNumber)
  sortedValuesOfAnalyticsArray.forEach((item, itemIndex) => {
    if (item <= maxNumber) {
      bucketInnerItemCount++
    } else {
      minNumber = item
      maxNumber = item + ((bucketCount + 1) * binSize)
      bucketInnerItemCount = 1
      midPoint = minNumber + binSize / 2
    }
    analytics[midPoint] = bucketInnerItemCount
  })
  // console.log(analytics)
  const result = Object.entries(analytics).map(([label, value]) => ({
    label: Number(label).toFixed(2),
    name: Number(label).toFixed(2),
    value
  }));
  return result;
}

export async function GET(req, res) {
  let keywords = {};
  let keywordsAnalytics = {};
  let analyticsKey = "device";
  let yAnalyticsKey = "deviceVersion";
  let histogramValidKey = [];
  let bins = 5;
  if (req.nextUrl.searchParams.get('analyticsKey')) {
    analyticsKey = req.nextUrl.searchParams.get('analyticsKey');
  }
  if (req.nextUrl.searchParams.get('yAnalyticsKey')) {
    yAnalyticsKey = req.nextUrl.searchParams.get('yAnalyticsKey');
  }
  if (req.nextUrl.searchParams.get('histogramValidKey')) {
    histogramValidKey = JSON.parse(req.nextUrl.searchParams.get('histogramValidKey'));
  }
  if (req.nextUrl.searchParams.get('bins')) {
    bins = req.nextUrl.searchParams.get('bins');
  }
  if (req.nextUrl.searchParams.get('clientid')) {
    keywords.clientid = req.nextUrl.searchParams.get('clientid');
  }
  if (req.nextUrl.searchParams.get('codingActivity')) {
    keywords.codingActivity = req.nextUrl.searchParams.get('codingActivity');
    keywordsAnalytics.codingActivity = req.nextUrl.searchParams.get('codingActivity');
  }
  await connectMongoDB();
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize')) || 30;
  const page = Number(req.nextUrl.searchParams.get('pageNumber')) || 1;
  const count = await Analytics.countDocuments({ ...keywords });
  const analyticsForChart = await Analytics.find({ ...keywordsAnalytics });
  const findFromDbApi = Analytics.find({ ...keywords })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  if (req.nextUrl.searchParams.get('sort')) {
    // console.log("sort option ", req.nextUrl.searchParams.get('sort'))
    findFromDbApi.sort(req.nextUrl.searchParams.get('sort'))
  }
  const results = await findFromDbApi.exec();
  const barAnalytics = calculateAnalyticsPieChart(analyticsForChart, analyticsKey, yAnalyticsKey)
  const barchart = calculateAnalyticsHistogram(analyticsForChart, yAnalyticsKey, analyticsKey, bins)
  const codingActivity = await CodingActivity.findById(keywords.codingActivity).select('featureEngineeringCode');
  return Response.json({
    results,
    page,
    pages: Math.ceil(count / pageSize),
    analytics: calculateAnalyticsPieChart(analyticsForChart, yAnalyticsKey, analyticsKey),
    barAnalytics: histogramValidKey.includes(yAnalyticsKey) ? barchart:  histogramValidKey.includes(yAnalyticsKey),
    barAnalyticsD: barAnalytics,
    codingActivity
  }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
// @desc Post videoClipList
// @route POST api/videoClipLists
// @acess Privet
function calculateTimeDifference(activity) {

  const startTime = activity.sessionTime.start;
  const endTime = activity.sessionTime.end;
  const difference = endTime - startTime;
  return difference / 1000; // Convert milliseconds to seconds
}
export async function POST(req) {
  const body = await req.formData();
  await connectMongoDB();
  if (body.get('session')) {
    const analyticsById = await Analytics.findById(body.get('session'));
    if (!analyticsById.sessionTime.start) {
      analyticsById.sessionTime.start = body.get('time');
    } else {
      analyticsById.sessionTime.end = body.get('time');
      analyticsById.sessionTime.total = calculateTimeDifference(analyticsById);
    }
    await analyticsById.save();
    return Response.json({ ...analyticsById._doc });
  }

  const ip = req?.ip || getClientIp(req) || req.headers.get('X-Forwarded-For')
  const ipData = await axios.get(`https://ipinfo.io/${ip}/json?token=${process.env.NEXT_PUBLIC_IP_IPINFO_TOKEN}`);

  const ipinfo = ipData?.data || {
    city: req.geo.city,
    country: req.geo.country,
    region: req.geo.region,
    loc: 'unknown',
    org: 'unknown',
    postal: 'unknown',
    timezone: 'unknown',
  }
  if (ipinfo.loc) {
    const loc = ipinfo.loc.split(',');
    ipinfo.latitude = loc[0];
    ipinfo.longitude = loc[1];
  }
  if (ipinfo.org) {
    const org = ipinfo.org.split(' ');
    ipinfo.asn = {
      asn: org[0],
      name: org.slice(1).join(' '),
    }
  }
  if (ipinfo.timezone) {
    const timezone = ipinfo.timezone.split('/');
    ipinfo.timezone = {
      tz: `${timezone[0]}/${timezone[1]}`,
      continent: timezone[0],
      city: timezone[1],
    }
  }
  const createdAnalytics = await Analytics.create({
    ip: ip,
    ipinfo: ipinfo,
    uid: body.get('uid'),
    device: body.get('device') || req.headers.get("sec-ch-ua-platform"),
    deviceVersion: body.get('deviceVersion') || req.headers.get("sec-ch-ua"),
    browser: body.get('browser') || req.headers.get("sec-ch-ua"),
    browserVersion: body.get('browserVersion') || req.headers.get("sec-ch-ua-platform"),
    screenWidth: body.get('screenWidth'),
    screenHeight: body.get('screenHeight'),
    user: body.get('user'),
    codingActivity: body.get('codingActivity'),
    sessionTime: {
      start: body.get('time'),
      end: null,
      total: 0,
    },
  });
  return Response.json({ ...createdAnalytics._doc });
}
// fix formation
export async function PUT(req) {
  await connectMongoDB();
  const analytics = await Analytics.find({});
  if (analytics) {
    for (const analytic of analytics) {
      const analyticsById = await Analytics.findById(analytic._id);
      // if (analyticsById.time) {
      //   analyticsById.sessionTime = {
      //     start: analyticsById.time[0],
      //     end: analyticsById.time[analyticsById.time.length - 1],
      //     total: analyticsById.totalDurationInSeconds,
      //   };
      // }
      // if(analyticsById.ipinfo){
      //   const ipinfo = analyticsById.ipinfo;
      //   if (ipinfo.loc) {
      //     const loc = ipinfo.loc.split(',');
      //     ipinfo.latitude = loc[0];
      //     ipinfo.longitude = loc[1];
      //   }
      //   if (ipinfo.org) {
      //     const org = ipinfo.org.split(' ');
      //     ipinfo.asn = {
      //       asn: org[0],
      //       name: org.slice(1).join(' '),
      //     }
      //   }
      // }
      // if(analyticsById.browser){
      //   analyticsById.browserVersion = analyticsById.browser.split('-')[1];
      //   analyticsById.browser = analyticsById.browser.split('-')[0];
      // }
      // if(analyticsById.device){
      //   analyticsById.deviceVersion = analyticsById.device.split('-')[1];
      //   analyticsById.device = analyticsById.device.split('-')[0];
      // }
      // if(analyticsById.ipinfo.timezone){
      //   analyticsById.ipinfo.continent = analyticsById.ipinfo.timezone.split('/')[0];
      //   analyticsById.ipinfo.continentCity = analyticsById.ipinfo.timezone.split('/')[1];
      // }
      // analyticsById.ipinfo.timezone = {};
      // if(analyticsById?.ipinfo?.continent){
      //   analyticsById.ipinfo.timezone.continent = analyticsById?.ipinfo?.continent;
      // }
      // if(analyticsById?.ipinfo?.continentCity){
      //   analyticsById.ipinfo.timezone.city = analyticsById?.ipinfo?.continentCity;
      // }
      // if(analyticsById?.ipinfo?.timezone){
      //   analyticsById.ipinfo.timezone.tz = `${analyticsById?.ipinfo?.continent}/${analyticsById?.ipinfo?.continentCity}`;
      // }
      delete analyticsById.time;
      delete analyticsById.totalDurationInSeconds;
      await analyticsById.save();
    }
  }

  return Response.json({ message: 'Analytics updated' });
}


// @desc Delete productRoute
// @route DELETE api/productRoutes
// @acess Privet
export async function DELETE(req, context) {
  const body = await req.json();
  await connectMongoDB();
  const deleteIdList = body.ids;
  const codeExecutorActivityList = await Analytics.find({ _id: { $in: deleteIdList } });
  if (codeExecutorActivityList) {
    const deletedRecord = await Analytics.deleteMany({
      _id: { $in: deleteIdList },
    });
    return Response.json({ message: 'Analytics removed', deletedRecord });
  } else {
    return Response.json(
      { message: 'Analytics not found' },
      { status: 404 },
    );
  }
}
