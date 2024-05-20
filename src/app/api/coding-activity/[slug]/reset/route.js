import connectMongoDB from '@/config/connectMongoDB.js';

import CodingActivity from '@/models/codingActivityModel.js';
import filehandler from '@/lib/filehandler';
import { admin, protect } from '@/authorizationMiddlewares/authMiddleware';
import User from '@/models/userModel';


// @desc POST codeExecutorActivity
// @route POST api/codeExecutorActivitys/:id
// @acess Privet
// duplicate codeExecutorActivity
export async function POST(req, context) {
  if (
    !(await protect(req))
  ) {

    return Response.json({ mesg: "Not authorized" })
  }
  const { params } = context;
  const body = await req.json();
  await connectMongoDB();
  const codeExecutorActivity = await CodingActivity.findById(params.slug);
  const parentActivity = await CodingActivity.findById(body.parentActivity);
  // const user = await User.findById(codeExecutorActivity.user)
  // console.log(req?.user?.userName == user.userName)
  // start if
  if (codeExecutorActivity && parentActivity) {

    // convert to js object
    codeExecutorActivity.activityCodeExecutor = parentActivity.activityCodeExecutor
    codeExecutorActivity.activityCodeRuntime = parentActivity.activityCodeRuntime
    codeExecutorActivity.activityDefaultCode = parentActivity.activityDefaultCode
    codeExecutorActivity.gptModel = parentActivity.gptModel
    codeExecutorActivity.systemPrompt = parentActivity.systemPrompt
    codeExecutorActivity.uiContent = parentActivity.uiContent
    await codeExecutorActivity.save()
    return Response.json({ ...codeExecutorActivity._doc });

    // end if
  } else {
    return Response.json(
      { message: 'CodingActivity not found' },
      { status: 404 },
    );
  }
}