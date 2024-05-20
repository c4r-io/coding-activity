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
  await connectMongoDB();
  const codeExecutorActivity = await CodingActivity.findById(params.slug);
  // const user = await User.findById(codeExecutorActivity.user)
  // console.log(req?.user?.userName == user.userName)
  // start if
  if (codeExecutorActivity) {
    // convert to js object
    const datawithoutId = codeExecutorActivity._doc;
    const parentId = datawithoutId._id;
    delete datawithoutId._id;
    const updatedCodingActivity = await CodingActivity.create({
      ...datawithoutId,
      activityTitle: datawithoutId.activityTitle + ' copy',
      parentActivity: parentId
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