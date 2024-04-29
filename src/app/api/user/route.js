import connectMongoDB from '@/config/connectMongoDB.js';
import User from '@/models/userModel.js';
import { admin, protect } from '@/middleware/authMiddleware';
import filehandler from '@/lib/filehandler';
// @desc Get all users
// @route GET api/users
// @acess Privet
export async function GET(req, res) {
  const keywords = {
    email: { $ne: 'arash@gmail.com'}
  };
  // in case if the query is not js object
  // if (
  //   !(await protect(req))
  // ) {
  //   return Response.json({ mesg: "Not authorized" })
  // }
  connectMongoDB();
  const pageSize = Number(req.nextUrl.searchParams.get('pageSize')) || 30;
  const page = Number(req.nextUrl.searchParams.get('pageNumber')) || 1;
  const count = await User.countDocuments({ ...keywords });
  const apiFunction = User.find({ ...keywords })
    .limit(pageSize)
    .skip(pageSize * (page - 1))
    .sort({ createdAt: -1 });
  let selectedString = '';
  if (req.nextUrl.searchParams.get('select')) {
    selectedString += ' ' + req.nextUrl.searchParams.get('select');
  }
  apiFunction.select(selectedString);
  apiFunction.select('-password');
  const users = await apiFunction.exec();
  return Response.json({ users, page, pages: Math.ceil(count / pageSize) });
}
// @desc Post user
// @route POST api/users
// @acess Privet
export async function POST(req, context) {
  connectMongoDB();
  const user = {};
  // start if
  if (user) {
    // convert to js object
    const body = await req.formData();
    if (body.get('userName')) {
      user['userName'] = body.get('userName');
    }
    if (body.get('email')) {
      user['email'] = body.get('email');
    }
    if (body.get('password')) {
      user['password'] = body.get('password');
    }
    const createdUser = await User.create({ ...user });
    return Response.json({ ...createdUser._doc, password: null });
    // end if
  }
}
