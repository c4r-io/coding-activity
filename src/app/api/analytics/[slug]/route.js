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
      if (!analytics.submission1.issue) {
        analytics.submission1.issue = body.get('issue');
        analytics.submission1.attachment = { data: body.get('attachment') };
      }
      else if (analytics.submission1.issue && !analytics.submission2.issue) {
        analytics.submission2.issue = body.get('issue');
        analytics.submission2.attachment = { data: body.get('attachment') };
      }
      else if (analytics.submission2.issue && !analytics.submission3.issue) {
        analytics.submission3.issue = body.get('issue');
        analytics.submission3.attachment = { data: body.get('attachment') };
      } else {
        analytics.submissionList.push({
          issue: body.get('issue'),
          attachment: { data: body.get('attachment') }
        })
      }
    }
    if (body.get('issueCode')) {
      if (!analytics.error1.errorCode) {
        analytics.error1.errorCode = body.get('errorCode');
        analytics.error1.description = { data: body.get('description') };
      }
      else if (analytics.error1.errorCode && !analytics.error2.errorCode) {
        analytics.error2.errorCode = body.get('errorCode');
        analytics.error2.description = { data: body.get('description') };
      }
      else if (analytics.error2.errorCode && !analytics.error3.errorCode) {
        analytics.error3.errorCode = body.get('errorCode');
        analytics.error3.description = { data: body.get('description') };
      } else {
        analytics.errorList.push({
          errorCode: body.get('errorCode'),
          description: { data: body.get('description') }
        })
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
