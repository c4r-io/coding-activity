import connectMongoDB from '@/config/connectMongoDB.js';
import User from '@/models/userModel.js';
import { admin, protect } from '@/middleware/authMiddleware';
import filehandler from '@/lib/filehandler';
// @desc Get user by id
// @route GET api/users/:id
// @acess Privet
export async function GET(req, context) {
  // if (
  //   !(await protect(req))
  // ) {
  //   return Response.json({ mesg: "Not authorized" })
  // }
  const { params } = context;
  connectMongoDB();
  const apiFunction = User.findById(params.slug);
  let selectedString = '-password';
  if (req.nextUrl.searchParams.get('select')) {
    selectedString += ' ' + req.nextUrl.searchParams.get('select');
  }
  apiFunction.select(selectedString);
  const users = await apiFunction.exec();
  return Response.json({ users });
}
// @desc Put user
// @route PUT api/users/:id
// @acess Privet
export async function PUT(req, context) {
  if (!(await protect(req))) {
    return Response.json({ mesg: 'Not authorized' });
  }
  const { params } = context;
  connectMongoDB();
  const user = await User.findById(params.slug);
  // start if
  if (user) {
    // convert to js object
    const body = await req.formData();
    if (body.get('userName')) {
      user.userName = body.get('userName');
    }
    if (body.get('email')) {
      user.email = body.get('email');
    }
    if (body.get('password')) {
      user.password = body.get('password');
    }
    const updatedUser = await user.save();
    return Response.json({ ...updatedUser._doc, password: null });
    // end if
  }
}
// @desc Delete user by id
// @route DELETE api/users/:id
// @acess Privet
export async function DELETE(req, context) {
  const { params } = context;
  connectMongoDB();
  const users = await User.findById(params.slug);
  if (users) {
    await users.deleteOne();
    return Response.json({ message: 'User removed' });
  } else {
    return Response.json({ message: 'User not found' }, { status: 404 });
  }
}
