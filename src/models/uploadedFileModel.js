import mongoose from 'mongoose';
const uploadedFileSchema = mongoose.Schema(
  {
    fileData: {
      type: Object,
    },
  },
  {
    timestamps: true,
  },
);
const UploadedFile =
  mongoose.models.UploadedFile ||
  mongoose.model('UploadedFile', uploadedFileSchema);
export default UploadedFile;
