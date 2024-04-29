import connectMongoDB from '@/config/connectMongoDB.js';
import User from '@/models/userModel.js';
import filehandler from '@/lib/filehandler';
import UploadedFile from '@/models/uploadedFileModel';

export async function POST(req, context) {
  connectMongoDB();
  // start if
  const body = await req.formData();
  if (!body.get('image')) {
    return Response.json({ error: 'No file uploaded' }, { status: 400 }); 
  }
  const uploadedFile = new UploadedFile({
    fileData: await filehandler.saveFileAsBinary(body.get('image'))
  })
  const created = await uploadedFile.save()
  return Response.json({ ...created._doc });

}
