import connectMongoDB from '@/config/connectMongoDB.js';
import CodeExecutorIssueList from '@/models/codeExecutorIssueListModel.js';
import { admin, protect } from '@/middleware/authMiddleware';
import filehandler from '@/lib/filehandler';
// @desc Get all codeExecutorIssueLists
// @route GET api/codeExecutorIssueLists
// @acess Privet
export async function GET(req, res) {
  const keywords = {};
  if(req.nextUrl.searchParams.get('codingActivity')) {
    keywords['codingActivity'] = req.nextUrl.searchParams.get('codingActivity');
  }
  // in case if the query is not js object
  // if (
  //   !(await protect(req))
  // ) {
  //   return Response.json({ mesg: "Not authorized" })
  // }
  connectMongoDB();
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize')) || 30;
  const page = Number(req.nextUrl.searchParams.get('pageNumber')) || 1;
  const count = await CodeExecutorIssueList.countDocuments({ ...keywords });
  const apiFunction = CodeExecutorIssueList.find({ ...keywords })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 })
    .populate('user');
  if (req.nextUrl.searchParams.get('select')) {
    apiFunction.select(req.nextUrl.searchParams.get('select'));
  }
  const results = await apiFunction.exec();
  return Response.json({
    results,
    page,
    pages: Math.ceil(count / pageSize),
  });
}
// @desc Post codeExecutorIssueList
// @route POST api/codeExecutorIssueLists
// @acess Privet
export async function POST(req, context) {
  connectMongoDB();
  const codeExecutorIssueList = {};
  // start if
  const body = await req.formData();
  if (body.get('user')) {
    codeExecutorIssueList['user'] = body.get('user');
  }
  if (body.get('codingActivity')) {
    codeExecutorIssueList['codingActivity'] = body.get('codingActivity');
  }
  // console.log('codingActivity', body.get('codingActivity'));
  if (body.get('description')) {
    codeExecutorIssueList['description'] = body.get('description');
  }
  if (
    body.get('attachment') &&
    codeExecutorIssueList.attachment !== body.get('attachment')
  ) {
    const filename = await filehandler.saveFileAsBinary(
      body.get('attachment'),
    );
    // const filename = await filehandler.saveFile(body.get("attachment"))
    // filehandler.deleteFile(codeExecutorIssueList.attachment)
    codeExecutorIssueList['attachment'] = filename;
  }
  if (codeExecutorIssueList) {
    console.log("codeExecutorIssueList", codeExecutorIssueList)
    const createdCodeExecutorIssueList = await CodeExecutorIssueList.create(
      { ...codeExecutorIssueList },
    );
    return Response.json({ ...createdCodeExecutorIssueList._doc });
    // end if
  } else {
    return Response.json(
      { message: 'CodeExecutorIssueList not found' },
      { status: 404 },
    );
  }
}


// @desc Delete productRoute
// @route DELETE api/productRoutes
// @acess Privet
export async function DELETE(req, context) {
  const body = await req.json();
  connectMongoDB();
  const deleteIdList = body.ids;
  const codeExecutorIssueList = await CodeExecutorIssueList.find({ _id: { $in: deleteIdList } });
  if (codeExecutorIssueList) {
    const deletedRecord = await CodeExecutorIssueList.deleteMany({
      _id: { $in: deleteIdList },
    });
    return Response.json({ message: 'CodeExecutorIssueList removed', deletedRecord });
  } else {
    return Response.json(
      { message: 'CodeExecutorIssueList not found' },
      { status: 404 },
    );
  }
}

