import connectMongoDB from '@/config/connectMongoDB.js';
import filehandler from '@/lib/filehandler';
import UploadedFile from '@/models/uploadedFileModel';

// @desc Get all upload
// @route GET api/upload
// @acess Privet
export async function GET(req, context) {
  const keywords = {};
  if (req.nextUrl.searchParams.get('search')) {
    keywords['fileData']['name'] = { $regex: req.nextUrl.searchParams.get('search'), $options: 'i' }
  }
  await connectMongoDB();

  // start if
  const results = await UploadedFile.find({...keywords})
  // console.log("results", results)
  return Response.json({ results, msg: "file list"});
}
// @desc Post upload
// @route POST api/upload
// @acess Privet
export async function POST(req, context) {
  await connectMongoDB();
  // start if
  const body = await req.formData();
  if (!body.get('image')) {
    return Response.json({ error: 'No file uploaded' }, { status: 400 });
  }
  if (body.get('imageId')) {
    const uploadedFile = await UploadedFile.findById(body.get('imageId'))
    uploadedFile.fileData = await filehandler.saveFileAsBinary(body.get('image'))
    await uploadedFile.save()
    return Response.json({ ...uploadedFile._doc, msg: "file updated" });
  }
  const uploadedFile = new UploadedFile({
    fileData: await filehandler.saveFileAsBinary(body.get('image'))
  })
  const created = await uploadedFile.save()
  return Response.json({ ...created._doc, msg: "file uploaded"});
}
// @desc Delete upload
// @route DELETE api/upload
// @acess Privet
export async function DELETE(req, context) {
  await connectMongoDB();
  // start if
  const body = await req.json();
  if (!body.imageIds) {
    return Response.json({ error: 'Not found' }, { status: 400 });
  }
  if (body.imageIds) {
    const imageIds = body.imageIds
    const deleteDetails = await UploadedFile.deleteMany({ _id: { $in: imageIds } })
    return Response.json({ deleteDetails, msg: "file deleted" });
  }
}
