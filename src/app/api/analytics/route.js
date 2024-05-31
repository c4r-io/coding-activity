import connectMongoDB from '@/config/connectMongoDB.js';
import { admin, protect } from '@/authorizationMiddlewares/authMiddleware';
import Analytics from '@/models/analyticsModel';
import CodingActivity from '@/models/codingActivityModel';
import { getClientIp } from 'request-ip';
import axios from 'axios';
import mongodbClient from '@/config/mongodbClient';
// @desc Get all videoClipLists
// @route GET api/videoClipLists
// @acess Privet
import _, { mean } from 'lodash'

function convertToPieChartData(array) {
  // Step 1: Clean and normalize the data
  const cleanedData = array
    .filter(item => item.label !== null && item.value !== null) // Remove null values
    .map(item => ({
      label: String(item.label).replace(/"/g, ''), // Remove quotes from labels
      value: String(item.value).split(';')[0].split(' ')[0] // Clean value, take the first part before any semicolon or space
    }));

  // Step 2: Count occurrences of each label
  const labelCount = {};
  cleanedData.forEach(item => {
    if (labelCount[item.label]) {
      labelCount[item.label]++;
    } else {
      labelCount[item.label] = 1;
    }
  });

  // Step 3: Calculate the percentage for each label
  const totalCount = cleanedData.length;
  const pieChartData = Object.keys(labelCount).map(label => ({
    label: label,
    name: label,
    value: (labelCount[label].toFixed(2)),
    valueInPercent: ((labelCount[label] / totalCount * 100).toFixed(2))
  }));

  return pieChartData;
}
function groupByPiChart(rawData, groupByAttr, targetAttr, reduction = false) {
  const data = rawData.map(item => {
    const grpBy = groupByAttr.split('.');
    const grpByVal = grpBy.reduce((acc, cur) => acc && acc[cur], item);
    const targBy = targetAttr.split('.');
    const targByVal = targBy.reduce((acc, cur) => acc && acc[cur], item);
    return {
      [grpBy]: grpByVal,
      [targBy]: targByVal
    };
  })
  console.log(data)
  const grouped = _.groupBy(data, groupByAttr);

  const mode = arr => {
    const frequency = {};
    let maxFreq = 0;
    let mode = null;

    for (const item of arr) {
      frequency[item] = (frequency[item] || 0) + 1;
      if (frequency[item] > maxFreq) {
        maxFreq = frequency[item];
        mode = item;
      }
    }

    return mode;
  };

  const groupedMode = _.mapValues(grouped, values => mode(values.map(d => d[targetAttr])));

  let result = [];
  if (reduction) {
    result = _.map(groupedMode, (value, key) => ({
      [groupByAttr]: key,
      [targetAttr]: value
    }));
  } else {
    result = data.map(d => ({
      ...d,
      [targetAttr]: groupedMode[d[groupByAttr]]
    }));
  }

  // Convert result to the specified format
  const formattedResult = result.map(item => ({
    label: item[groupByAttr],
    value: item[targetAttr]
  }));

  return convertToPieChartData(formattedResult);
}
function calculateHistogram(data, bins) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const binWidth = (max - min) / bins;

  const histogram = Array(bins).fill(0);
  const histogramData = Array.from({ length: bins }, (v, i) => {
    return {
      binStart: (min + i * binWidth).toFixed(2),
      binEnd: (min + (i + 1) * binWidth).toFixed(2),
      count: 0,
      label: `${(min + i * binWidth).toFixed(2)} - ${(min + (i + 1) * binWidth).toFixed(2)}`,
      value: 0
    }
  });

  data.forEach(value => {
    let binIndex = Math.floor((value - min) / binWidth);
    if (binIndex === bins) binIndex--; // To handle the max value case
    histogram[binIndex]++;
  });

  return histogramData.map((item, index) => {
    if (histogram[index]) {
      item.count = histogram[index];
      item.value = histogram[index];
    }
    return item;
  });
}
function groupByHistogram(rawData, groupByAttr, targetAttr, reduction = false, bins = 5) {
  let targByAttr = "";
  let grpByAttr = "";
  const data = rawData.map(item => {
    const grpBy = groupByAttr.split('.');
    grpByAttr = grpBy[grpBy.length - 1];
    const grpByVal = grpBy.reduce((acc, cur) => acc && acc[cur], item);
    const targBy = targetAttr.split('.');
    targByAttr = targBy[targBy.length - 1];
    const targByVal = targBy.reduce((acc, cur) => acc && acc[cur], item);
    return {
      [grpByAttr]: grpByVal,
      [targByAttr]: targByVal
    };
  })
  const groupedData = data.reduce((acc, item) => {
    const key = item[grpByAttr];
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(item[targByAttr]);
    return acc;
  }, {});

  // console.log(groupedData)
  const result = Object.keys(groupedData).map(key => {
    const values = groupedData[key];
    const avg = mean(values);
    return reduction ? { [grpByAttr]: key, [targByAttr]: avg } : values.map(value => ({ [grpByAttr]: key, [targByAttr]: avg }));
  });

  const op = reduction ? result : result.flat();
  const histogram = op.map(entry => entry[targByAttr]).sort((a, b) => a - b);
  // console.log(histogram)
  // return op
  return calculateHistogram(histogram, bins)
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
function calculateAnalyticsPieChart({ array, key }) {
  const analytics = {};
  const analyticsArray = [];
  let analyticsArrayKeys = [];

  array.forEach(item => {
    const keys = key.split('.');
    const value1 = keys.reduce((acc, cur) => acc && acc[cur], item);

    if (value1 !== undefined) {
      // const label = `${value1}-${value2}`;
      const label = `${value1}`;
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
    analytics[`${key}`] = value.length
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
function calculateAnalyticsHistogram({ array, key, bins = 5 }) {
  const analytics = {};
  const analyticsMaxList = [];
  const analyticsReploted = []
  const analyticsArray = [];
  let analyticsArrayKeys = [];

  array.forEach(item => {
    const keys = key.split('.');
    const value1 = keys.reduce((acc, cur) => acc && acc[cur], item);

    if (value1 !== undefined) {
      // const label = `${value1}-${value2}`;
      const label = `${value1}`;
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
  let reduction = false;
  if (req.nextUrl.searchParams.get('reduction')) {
    reduction = req.nextUrl.searchParams.get('reduction');
  }
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
  const codingActivity = await CodingActivity.findById(keywords.codingActivity).select('featureEngineeringCode');

  const getPiChartData = () => {
    if (yAnalyticsKey) {
      return groupByPiChart(analyticsForChart, analyticsKey, yAnalyticsKey, reduction)
    };
    return calculateAnalyticsPieChart({ array: analyticsForChart, key: analyticsKey })
  }
  const getHistogramChartData = () => {
    if (yAnalyticsKey) {
      return groupByHistogram(analyticsForChart, yAnalyticsKey, analyticsKey, reduction, bins)
    }
    return calculateAnalyticsHistogram({ array: analyticsForChart, key: analyticsKey, bins: bins });
  }

  return Response.json({
    results,
    page,
    pages: Math.ceil(count / pageSize),
    analytics: histogramValidKey.includes(analyticsKey) ? false : getPiChartData(),
    barAnalytics: histogramValidKey.includes(analyticsKey) ? getHistogramChartData() : false,
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

export async function POST(req) {
  const body = await req.formData();
  await connectMongoDB();
  if (body.get('session')) {
    const analyticsById = await Analytics.findById(body.get('session'));
    if (!analyticsById?.sessionStartTime) {
      analyticsById.sessionStartTime = body.get('time');
    } else {
      analyticsById.sessionEndTime = body.get('time');
    }
    await analyticsById.save();
    return Response.json({ ...analyticsById._doc });
  }
  const dataToSave = {}
  const ip = req?.ip || getClientIp(req) || req.headers.get('X-Forwarded-For')
  const ipData = await axios.get(`https://ipinfo.io/${ip}/json?token=${process.env.NEXT_PUBLIC_IP_IPINFO_TOKEN}`);
  if (ip) {
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
  if (ipinfo.region) {
    dataToSave.region = ipinfo.region;
  }
  if (ipinfo.country) {
    dataToSave.country = ipinfo.country;
  }
  if (ipinfo.postal) {
    dataToSave.postal = ipinfo.postal;
  }
  if (ipinfo.city) {
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
  if (body.get('screenWidth')) {
    dataToSave.screenWidth = body.get('screenWidth');
  }
  if (body.get('screenHeight')) {
    dataToSave.screenHeight = body.get('screenHeight');
  }
  if (body.get('screenWidth') &&
    body.get('screenHeight')) {
    dataToSave.aspectRatio = body.get('screenWidth') / body.get('screenHeight');
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

export async function PUT(req) {
  const body = await req.json()
  const client = await mongodbClient;
  const db = client.db();
  const upd = []
  for (const updatedData of body.updateDataList) {
    const id = updatedData._id;
    delete updatedData._id;
    const analytics = await db
      .collection("analytics")
      .find();
    // .updateOne({ _id: id }, { $set: {...updatedData} });
    upd.push({ id, analytics })

  }
  return Response.json({ message: 'Analytics updated', upd, d: body.updateDataList });
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
