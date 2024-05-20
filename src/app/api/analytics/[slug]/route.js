import connectMongoDB from '@/config/connectMongoDB.js';
import Analytics from '@/models/analyticsModel';
import { admin, protect } from '@/authorizationMiddlewares/authMiddleware';
import filehandler from '@/lib/filehandler';
// @desc Get pythonExecutorIssueList by id
// @route GET api/pythonExecutorIssueLists/:id
// @acess Privet
export async function GET(req, context) {
  // if (
  //   !(await protect(req))
  // ) {
  //   return Response.json({ mesg: "Not authorized" })
  // }
  const { params } = context;
  await connectMongoDB();
  const apiFunction = Analytics.findById(params.slug);
  if (req.nextUrl.searchParams.get('select')) {
    apiFunction.select(req.nextUrl.searchParams.get('select'));
  }
  const results = await apiFunction.exec();
  return Response.json({ results });
}
// @desc Put pythonExecutorIssueList
// @route PUT api/pythonExecutorIssueLists/:id
// @acess Privet
export async function PUT(req, context) {
  if (!(await protect(req))) {
    return Response.json({ mesg: 'Not authorized' });
  }
  const { params } = context;
  await connectMongoDB();
  const codeExecutorIssueList = await Analytics.findById(
    params.slug,
  );
  // start if
  if (codeExecutorIssueList) {
    // convert to js object
    const body = await req.formData();
    if (body.get('description')) {
      codeExecutorIssueList.description = body.get('description');
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
      codeExecutorIssueList.attachment = filename;
    }
    const updatedAnalytics = await codeExecutorIssueList.save();
    return Response.json({ ...updatedAnalytics._doc });
    // end if
  } else {
    return Response.json(
      { message: 'Analytics not found' },
      { status: 404 },
    );
  }
}
// @desc Delete pythonExecutorIssueList by id
// @route DELETE api/pythonExecutorIssueLists/:id
// @acess Privet
export async function DELETE(req, context) {
  const { params } = context;
  await connectMongoDB();
  const pythonExecutorIssueLists = await Analytics.findById(
    params.slug,
  );
  if (pythonExecutorIssueLists) {
    //filehandler.deleteFile(pythonExecutorIssueLists.attachment)
    await pythonExecutorIssueLists.deleteOne();
    return Response.json({ message: 'Analytics removed' });
  } else {
    return Response.json(
      { message: 'Analytics not found' },
      { status: 404 },
    );
  }
}
