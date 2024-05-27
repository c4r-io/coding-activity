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
// @desc Post pythonExecutorIssueList
// @route POST api/pythonExecutorIssueLists/:id
// @acess Privet
export async function POST(req, context) {
  const { params } = context;
  await connectMongoDB();
  const analytics = await Analytics.findById(
    params.slug,
  );
  // start if
  if (analytics) {
    // convert to js object
    const body = await req.json();
    if (body.consoleIssue) {
      analytics.issueList.push(body.consoleIssue)
    }
    const updatedAnalytics = await analytics.save();
    return Response.json({ ...updatedAnalytics._doc });
    // end if
  } else {
    return Response.json(
      { message: 'Analytics not found' },
      { status: 404 },
    );
  }
}
// @desc Put pythonExecutorIssueList
// @route PUT api/pythonExecutorIssueLists/:id
// @acess Privet
export async function PUT(req, context) {
  const { params } = context;
  await connectMongoDB();
  const analytics = await Analytics.findById(
    params.slug,
  );
  // start if
  if (analytics) {
    // convert to js object
    const body = await req.formData();
    if (body.get('consoleIssue')) {
      analytics.issueList.push(body.get('consoleIssue'))
    }
    if (body.get('issue')) {
      if (!analytics.issue1) {
        analytics.issue1 = body.get('issue');
      }
      else if (analytics.issue1 && !analytics.issue2) {
        analytics.issue2 = body.get('issue');
      }
      else if (analytics.issue2 && !analytics.issue3) {
        analytics.issue3 = body.get('issue');
      } else {
        analytics.issueList.push(body.get('issue'))
      }
    }
    if (
      body.get('attachment')
    ) {
      const filename = { data: body.get('attachment') };
      if (!analytics.attachment1) {
        analytics.attachment1 = filename;
      }
      else if (analytics.attachment1 && !analytics.attachment2) {
        analytics.attachment2 = filename;
      }
      else if (analytics.attachment2 && !analytics.attachment3) {
        analytics.attachment3 = filename;
      } else {
        analytics.attachmentList.push(filename)
      }
    }
    const updatedAnalytics = await analytics.save();
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
