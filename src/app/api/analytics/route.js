import connectMongoDB from '@/config/connectMongoDB.js';
import { admin, protect } from '@/authorizationMiddlewares/authMiddleware';
import Analytics from '@/models/analyticsModel';
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

export async function GET(req, res) {
  let keywords = {};
  let keywordsAnalytics = {};
  let analyticsKey = "device"
  if (req.nextUrl.searchParams.get('analyticsKey')) {
    analyticsKey = req.nextUrl.searchParams.get('analyticsKey');
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
  const analyticsForChart = await Analytics.find({...keywordsAnalytics});
  const findFromDbApi = Analytics.find({ ...keywords })
    .limit(pageSize)
    .skip(pageSize * (page - 1));
  if (req.nextUrl.searchParams.get('sort')) {
    console.log("sort option ",req.nextUrl.searchParams.get('sort'))
    findFromDbApi.sort(req.nextUrl.searchParams.get('sort'))
  }
  const results = await findFromDbApi.exec();
  return Response.json({
    results,
    page,
    pages: Math.ceil(count / pageSize),
    analytics: countIdenticalValues(analyticsForChart, analyticsKey),
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
  if (activity.time.length < 2) {
    console.log("Not enough data to calculate time difference.");
    return 0;
  }

  const startTime = activity.time[0];
  const endTime = activity.time[activity.time.length - 1];
  const difference = endTime - startTime;
  return difference / 1000; // Convert milliseconds to seconds
}
export async function POST(req) {
  const body = await req.formData();
  await connectMongoDB();
  if (body.get('session')) {
    const analyticsById = await Analytics.findById(body.get('session'));
    analyticsById.time.push(body.get('time'));
    analyticsById.totalDurationInSeconds = calculateTimeDifference(analyticsById);
    await analyticsById.save();
    return Response.json({ ...analyticsById._doc });
  }

  const ip = req?.ip || getClientIp(req) || req.headers.get('X-Forwarded-For')
  const ipData = await axios.get(`https://ipinfo.io/${ip}/json?token=${process.env.NEXT_PUBLIC_IP_IPINFO_TOKEN}`);

  const createdvideoClipList = await Analytics.create({
    ip: ip,
    ipinfo: ipData?.data || {
      city: req.geo.city,
      country: req.geo.country,
      region: req.geo.region,
      loc: 'unknown',
      org: 'unknown',
      postal: 'unknown',
      timezone: 'unknown',
    },
    uid: body.get('uid'),
    device: body.get('device') || req.headers.get("sec-ch-ua-platform"),
    browser: body.get('browser') || req.headers.get("sec-ch-ua"),
    screenWidth: body.get('screenWidth'),
    screenHeight: body.get('screenHeight'),
    user: body.get('user'),
    codingActivity: body.get('codingActivity'),
    time: [body.get('time')],
    totalDurationInSeconds: 0,
  });
  return Response.json({ ...createdvideoClipList._doc });
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
