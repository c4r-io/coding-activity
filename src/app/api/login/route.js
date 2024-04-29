import generateToken from '@/utils/generateToken.js';
import connectMongoDB from '@/config/connectMongoDB.js';
import User from '@/models/userModel.js';
// @desc Post authorize users
// @route POST api/users/login
// @acess Privet
export async function POST(req, context) {
  const body = await req.formData();
  connectMongoDB();
  let user = await User.findOne({ email: body.get('email') });
  if (user && (await user.matchPassword(body.get('password')))) {
    return Response.json({
      _id: user._id,
      email: user.email,
      token: generateToken(user._id),
    });
  } else {
    return Response.json({ message: 'User not found' }, { status: 401 });
  }
}
