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
  if (!isValidEmail(body.get('email'))) {
    return Response.json(
      { message: 'Please enter valid email' },
      { status: 403 },
    );
  }
  let user = await User.findOne({ email: body.get('email') });
  if (user) {
    return Response.json({ message: 'User already exist' }, { status: 403 });
  } else {
    const user = await User.create({
      email: body.get('email'),
      password: body.get('password'),
      permission: 'self',
    });
    return Response.json(
      { _id: user._id, email: user.email, token: generateToken(user._id) },
      { status: 201 },
    );
  }
}
