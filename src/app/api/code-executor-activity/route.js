import connectMongoDB from '@/config/connectMongoDB.js';
import { admin, protect } from '@/middleware/authMiddleware';
import CodeExecutorActivity from '@/models/codeExecutorActivityModel.js';
// @desc Get all videoClipLists
// @route GET api/videoClipLists
// @acess Privet
export async function GET(req, res) {
  let keywords = {};
  const orKeywords = {};
  if (req.nextUrl.searchParams.get('activityTitle')) {
    keywords.activityTitle = req.nextUrl.searchParams.get('activityTitle');
  }
  if (req.nextUrl.searchParams.get('activityDefaultCode')) {
    keywords.activityDefaultCode = req.nextUrl.searchParams.get('activityDefaultCode');
  }
  if (req.nextUrl.searchParams.get('activityCodeExecutor')) {
    keywords.activityCodeExecutor = req.nextUrl.searchParams.get('activityCodeExecutor');
  }
  if (req.nextUrl.searchParams.get('activityCodeRuntime')) {
    keywords.activityCodeRuntime = req.nextUrl.searchParams.get('activityCodeRuntime');
  }
  console.log("or keywords ", [{ ...orKeywords }])
  if (Object.keys(orKeywords).length > 0) {
    keywords = {}
  }
  let select = ""
  // if (req.nextUrl.searchParams.get('select')) {
  //   select = req.nextUrl.searchParams.get('select').split(',')
  // }
  connectMongoDB();
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize')) || 30;
  const page = Number(req.nextUrl.searchParams.get('pageNumber')) || 1;
  const count = await CodeExecutorActivity.countDocuments({ $or: [{ ...orKeywords, ...keywords }] });
  const findFromDbApi = CodeExecutorActivity.find({ $or: [{ ...orKeywords, ...keywords }] })
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
export async function POST(req) {
  if (
    !(await protect(req))
  ) {
    return Response.json({ mesg: "Not authorized" }, { status: 401 })
  }
  const body = await req.json();
  connectMongoDB();
  const createdvideoClipList = await CodeExecutorActivity.create({
    activityTitle: body.activityTitle,
    activityDefaultCode: body.activityDefaultCode,
    activityCodeExecutor: body.activityCodeExecutor,
    activityCodeRuntime: body.activityCodeRuntime,
    uiContent: body.uiContent,
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
  const codeExecutorActivityList = await CodeExecutorActivity.find({ _id: { $in: deleteIdList } });
  if (codeExecutorActivityList) {
    const deletedRecord = await CodeExecutorActivity.deleteMany({
      _id: { $in: deleteIdList },
    });
    return Response.json({ message: 'CodeExecutorActivity removed', deletedRecord });
  } else {
    return Response.json(
      { message: 'CodeExecutorActivity not found' },
      { status: 404 },
    );
  }
}

