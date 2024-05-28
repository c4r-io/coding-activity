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
function calculateAnalyticsPieChart({array, key, key2}) {
  const analytics = {};
  const analyticsArray = [];
  let analyticsArrayKeys = [];

  array.forEach(item => {
    const keys = key.split('.');
    const value1 = keys.reduce((acc, cur) => acc && acc[cur], item);

    let keys2 = null,value2 = null;
    if(key2){
      keys2 = key2.split('.');
      value2 = keys2.reduce((acc, cur) => acc && acc[cur], item);
    }

    if (value1 !== undefined) {
      // const label = `${value1}-${value2}`;
      const label = value2 ? `${value2}`: `${value1}`;
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
    if(key2){
      analytics[`${key}-${maxRepeated.string}`] = value.length
    }else{
      analytics[`${key}`] = value.length
    }
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
function calculateAnalyticsHistogram({array, key, key2, bins = 5}) {
  const analytics = {};
  const analyticsMaxList = [];
  const analyticsReploted = []
  const analyticsArray = [];
  let analyticsArrayKeys = [];

  array.forEach(item => {
    const keys = key.split('.');
    const value1 = keys.reduce((acc, cur) => acc && acc[cur], item);

    let keys2 = null,value2 = null;
    if(key2){
      keys2 = key2.split('.');
      value2 = keys2.reduce((acc, cur) => acc && acc[cur], item);
    }

    if (value1 !== undefined) {
      // const label = `${value1}-${value2}`;
      const label = value2 ? `${value2}`: `${value1}`;
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
  let keywordsFilter = {};
  let analyticsKey = "device";
  let yAnalyticsKey = null;
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
  if (req.nextUrl.searchParams.get('filterKey') && req.nextUrl.searchParams.get('filterValue1')) {
    keywordsFilter[`${req.nextUrl.searchParams.get('filterKey')}`] = JSON.parse(req.nextUrl.searchParams.get('filterValue1'));
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
  const count = await Analytics.countDocuments({ ...keywords, ...keywordsFilter });
  const analyticsForChart = await Analytics.find({ ...keywordsAnalytics, ...keywordsFilter });
  const findFromDbApi = Analytics.find({ ...keywords, ...keywordsFilter })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  if (req.nextUrl.searchParams.get('sort')) {
    // console.log("sort option ", req.nextUrl.searchParams.get('sort'))
    findFromDbApi.sort(req.nextUrl.searchParams.get('sort'))
  }
  const results = await findFromDbApi.exec();
  const barchart = calculateAnalyticsHistogram({array:analyticsForChart, key2:yAnalyticsKey, key:analyticsKey, bins:bins})
  const codingActivity = await CodingActivity.findById(keywords.codingActivity).select('featureEngineeringCode');
  return Response.json({
    results,
    page,
    pages: Math.ceil(count / pageSize),
    analytics: histogramValidKey.includes(analyticsKey) ? false : calculateAnalyticsPieChart({array:analyticsForChart, key:analyticsKey}),
    barAnalytics: histogramValidKey.includes(analyticsKey) ? barchart:  histogramValidKey.includes(analyticsKey),
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
    if (!analyticsById.sessionStartTime) {
      analyticsById.sessionStartTime = body.get('time');
    } else {
      analyticsById.sessionEndTime = body.get('time');
      analyticsById.ssessionDuration = calculateTimeDifference(analyticsById);
    }
    await analyticsById.save();
    return Response.json({ ...analyticsById._doc });
  }
  const dataToSave = {}
  const ip = req?.ip || getClientIp(req) || req.headers.get('X-Forwarded-For')
  const ipData = await axios.get(`https://ipinfo.io/${ip}/json?token=${process.env.NEXT_PUBLIC_IP_IPINFO_TOKEN}`);
  if(ip){
    dataToSave.ip = ip;
  }
  const ipinfo = ipData?.data || {
    city: req.geo.city,
    country: req.geo.country,
    region: req.geo.region,
    loc: 'unknown',
    org: 'unknown',
    postal: 'unknown',
    timezone: 'unknown',
  }
  if(ipinfo.city){
    dataToSave.city = ipinfo.city;
  }
  if (ipinfo.loc) {
    const loc = ipinfo.loc.split(',');
    // ipinfo.latitude = loc[0];
    // ipinfo.longitude = loc[1];
    dataToSave.latitude = loc[0];
    dataToSave.longitude = loc[1];
  }
  if (ipinfo.org) {
    const org = ipinfo.org.split(' ');
    // ipinfo.asn = {
    //   asn: org[0],
    //   name: org.slice(1).join(' '),
    // }
    dataToSave.org = ipinfo.org;
    dataToSave.asn = org[0];
    dataToSave.asnName = org.slice(1).join(' ');
  }
  if (ipinfo.timezone) {
    dataToSave.timezone = ipinfo.timezone;
    dataToSave.continent = ipinfo.timezone.split('/')[0];
    // const timezone = ipinfo.timezone.split('/');
    // ipinfo.timezone = {
    //   tz: `${timezone[0]}/${timezone[1]}`,
    //   continent: timezone[0],
    //   city: timezone[1],
    // }
  }
  const createdAnalytics = await Analytics.create({
    uid: body.get('uid'),
    device: body.get('device') || req.headers.get("sec-ch-ua-platform"),
    deviceVersion: body.get('deviceVersion') || req.headers.get("sec-ch-ua"),
    browser: body.get('browser') || req.headers.get("sec-ch-ua"),
    browserVersion: body.get('browserVersion') || req.headers.get("sec-ch-ua-platform"),
    screenWidth: body.get('screenWidth'),
    screenHeight: body.get('screenHeight'),
    user: body.get('user'),
    codingActivity: body.get('codingActivity'),
    sessionStartTime: body.get('time'),
    sessionEndTime: null,
    sessionDuration: 0,
    ...dataToSave
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
      // delete analyticsById.time;
      // delete analyticsById.totalDurationInSeconds;
      if(analyticsById.screenWidth && analyticsById.screenHeight){
        analyticsById.aspectRatio = (analyticsById.screenWidth/ analyticsById.screenHeight).toFixed(2);
      }
      // analyticsById.sessionStartTime = analyticsById.sessionTime.start
      // analyticsById.sessionEndTime = analyticsById.sessionTime.end
      // analyticsById.sessionDuration = analyticsById.sessionTime.total
      // analyticsById.region = analyticsById.ipinfo.region
      // analyticsById.country = analyticsById.ipinfo.country
      // analyticsById.loc = analyticsById.ipinfo.loc
      // analyticsById.latitude = analyticsById.ipinfo.latitude
      // analyticsById.longitude = analyticsById.ipinfo.longitude
      // analyticsById.org = analyticsById.ipinfo.org
      // analyticsById.asn = analyticsById.ipinfo.asn.asn
      // analyticsById.asnName = analyticsById.ipinfo.asn.name
      // analyticsById.postal = analyticsById.ipinfo.postal
      // analyticsById.timezone = analyticsById.ipinfo.timezone.tz
      // analyticsById.city = analyticsById.ipinfo?.city || analyticsById.ipinfo?.continentCity || ""
      // analyticsById.continent = analyticsById.ipinfo.timezone.continent
      // console.log(analyticsById.city, JSON.stringify(Object.keys(analyticsById.ipinfo)))
      // console.log(analyticsById.aspectRatio)
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
