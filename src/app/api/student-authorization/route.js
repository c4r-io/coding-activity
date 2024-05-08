import generateToken from '@/utils/generateToken.js';
import connectMongoDB from '@/config/connectMongoDB.js';
import User from '@/models/userModel.js';
import isValidEmail from '@/utils/isValidEmail.js';
// @desc Post authorize users
// @route POST api/users/login
// @acess Privet
export async function POST(req, context) {
  const body = await req.formData();
  connectMongoDB();
  let user = await User.findOne({ userName: body.get('userName') });
  if (user) {
    let user2 = await User.findOne({ userName: body.get('userName') });
    if (user2 && (await user2.matchPassword(body.get('password')))) {
      return Response.json({
        _id: user._id,
        userName: user.userName,
        token: generateToken(user._id),
      });
    } else {
      return Response.json({ message: 'User not found' }, { status: 401 });
    }
  } else {
    const user = await User.create({
      userName: body.get('userName'),
      email: body.get('email')+"@sample.com",
      password: body.get('password'),
      permission: 'self',
    });
    return Response.json(
      { _id: user._id, userName: user.userName, token: generateToken(user._id) },
      { status: 201 },
    );
  }
}
