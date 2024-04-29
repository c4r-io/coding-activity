import connectMongoDB from '@/config/connectMongoDB.js';
import { admin, protect } from '@/middleware/authMiddleware';
import ChatFeedback from '@/models/chatFeedbackModel';
// @desc Get all videoClipLists
// @route GET api/videoClipLists
// @acess Privet
export async function GET(req, res) {
  let keywords = {};
  const orKeywords = {};
  if (req.nextUrl.searchParams.get('codeExecutorActivity')) {
    keywords.codeExecutorActivity = req.nextUrl.searchParams.get('codeExecutorActivity');
  }
  if (req.nextUrl.searchParams.get('feedback')) {
    keywords.feedback = req.nextUrl.searchParams.get('feedback');
  }

  connectMongoDB();
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize')) || 30;
  const page = Number(req.nextUrl.searchParams.get('pageNumber')) || 1;
  const count = await ChatFeedback.countDocuments({ $or: [{ ...orKeywords, ...keywords }] });
  const findFromDbApi = ChatFeedback.find({ $or: [{ ...orKeywords, ...keywords }] })
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
  const body = await req.formData();
  connectMongoDB();
  const createdvideoClipList = await ChatFeedback.create({
    codeExecutorActivity: body.get('codeExecutorActivity'),
    feedback: body.get('feedback'),
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
  const codeExecutorActivityList = await ChatFeedback.find({ _id: { $in: deleteIdList } });
  if (codeExecutorActivityList) {
    const deletedRecord = await ChatFeedback.deleteMany({
      _id: { $in: deleteIdList },
    });
    return Response.json({ message: 'ChatFeedback removed', deletedRecord });
  } else {
    return Response.json(
      { message: 'ChatFeedback not found' },
      { status: 404 },
    );
  }
}

