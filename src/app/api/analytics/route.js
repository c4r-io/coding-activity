import connectMongoDB from '@/config/connectMongoDB.js';
import { admin, protect } from '@/middleware/authMiddleware';
import Analytics from '@/models/analyticsModel';
// @desc Get all videoClipLists
// @route GET api/videoClipLists
// @acess Privet
export async function GET(req, res) {
  let keywords = {};
  if (req.nextUrl.searchParams.get('user')) {
    keywords.user = req.nextUrl.searchParams.get('user');
  }
  if (req.nextUrl.searchParams.get('codingActivity')) {
    keywords.codingActivity = req.nextUrl.searchParams.get('codingActivity');
  }
  connectMongoDB();
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize')) || 30;
  const page = Number(req.nextUrl.searchParams.get('pageNumber')) || 1;
  const count = await Analytics.countDocuments({ ...keywords });
  const findFromDbApi = Analytics.find({ ...keywords })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });
  // if (req.nextUrl.searchParams.get('select')) {
  //   findFromDbApi.select(req.nextUrl.searchParams.get('select').split(','))
  // }
  const results = await findFromDbApi.exec();
  return Response.json({
    results,
    page,
    pages: Math.ceil(count / pageSize),
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
  connectMongoDB();
  if (body.get('session')) {
    const analyticsById = await Analytics.findById(body.get('session'));
    analyticsById.time.push(body.get('time'));
    analyticsById.totalDurationInSeconds = calculateTimeDifference(analyticsById);
    await analyticsById.save();
    return Response.json({ ...analyticsById._doc });
  }
  const createdvideoClipList = await Analytics.create({
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
  connectMongoDB();
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

