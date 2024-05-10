import connectMongoDB from '@/config/connectMongoDB.js';

import CodingActivity from '@/models/codingActivityModel.js';
import filehandler from '@/lib/filehandler';
import { admin, protect } from '@/authorizationMiddlewares/authMiddleware';
import User from '@/models/userModel';

// @desc Get codeExecutorActivity by id
// @route GET api/codeExecutorActivitys/:id
// @acess Privet
export async function GET(req, context) {
  const { params } = context;
  await connectMongoDB();
  const results = await CodingActivity.findById(params.slug);
  return Response.json({ results }, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

// @desc Put codeExecutorActivity
// @route PUT api/codeExecutorActivitys/:id
// @acess Privet
export async function PUT(req, context) {
  if (
    !(await protect(req))
  ) {

    return Response.json({ mesg: "Not authorized" })
  }
  const { params } = context;
  await connectMongoDB();
  const codeExecutorActivity = await CodingActivity.findById(params.slug);
  // const user = await User.findById(codeExecutorActivity.user)
  // console.log(req?.user?.userName == user.userName)
  // start if
  if (codeExecutorActivity) {

    if (true) {

      // convert to js object
      const body = await req.formData();
      if (body.get('activityTitle')) {
        codeExecutorActivity.activityTitle = body.get('activityTitle');
      }
      if (body.get('gptModel')) {
        codeExecutorActivity.gptModel = body.get('gptModel');
      }
      if (body.get('systemPrompt')) {
        codeExecutorActivity.systemPrompt = body.get('systemPrompt');
      }
      if (body.get('activityDefaultCode')) {
        codeExecutorActivity.activityDefaultCode = body.get('activityDefaultCode');
      }
      if (body.get('activityCodeExecutor')) {
        codeExecutorActivity.activityCodeExecutor = body.get('activityCodeExecutor');
      }
      if (body.get('activityCodeRuntime')) {
        codeExecutorActivity.activityCodeRuntime = body.get('activityCodeRuntime');
      }
      if (body.get('uiContent')) {
        codeExecutorActivity.uiContent = JSON.parse(body.get('uiContent'));
      }
      if (
        body.get('thumbnail') &&
        codeExecutorActivity.thumbnail !== body.get('thumbnail')
      ) {
        const filename = await filehandler.saveFileAsBinary(body.get('thumbnail'));
        // filehandler.deleteFile(codeExecutorActivity.thumbnail);
        codeExecutorActivity.thumbnail = filename;
      }
      const updatedCodingActivity = await codeExecutorActivity.save();
      return Response.json({ ...updatedCodingActivity._doc });

    } else {
      return Response.json({ mesg: "Not authorized" })
    }
    // end if
  } else {
    return Response.json(
      { message: 'CodingActivity not found' },
      { status: 404 },
    );
  }
}

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
  await connectMongoDB();
  const codeExecutorActivity = await CodingActivity.findById(params.slug);
  // const user = await User.findById(codeExecutorActivity.user)
  // console.log(req?.user?.userName == user.userName)
  // start if
  if (codeExecutorActivity) {
    // convert to js object
    const datawithoutId = codeExecutorActivity._doc;
    delete datawithoutId._id;
    const updatedCodingActivity = await CodingActivity.create({
      ...datawithoutId,
      activityTitle: datawithoutId.activityTitle + ' copy',
    });
    return Response.json({ ...updatedCodingActivity._doc });

    // end if
  } else {
    return Response.json(
      { message: 'CodingActivity not found' },
      { status: 404 },
    );
  }
}
// @desc Delete codeExecutorActivity by id
// @route DELETE api/codeExecutorActivitys/:id
// @acess Privet
export async function DELETE(req, context) {
  if (
    !(await protect(req))
  ) {
    return Response.json({ mesg: "Not authorized" })
  }
  const { params } = context;
  await connectMongoDB();
  const codeExecutorActivitys = await CodingActivity.findById(params.slug);

  if (codeExecutorActivitys) {
    await codeExecutorActivitys.deleteOne();
    return Response.json({ message: 'CodingActivity removed' });
  } else {
    return Response.json(
      { message: 'CodingActivity not found' },
      { status: 404 },
    );
  }
}
