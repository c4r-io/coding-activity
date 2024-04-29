import connectMongoDB from "@/config/connectMongoDB"
import UploadedFile from "@/models/uploadedFileModel"


export default async function Handler(req, res) {
    if (req.method == 'GET') {
        const { slug: [fileid] } = req.query
        await connectMongoDB()
        console.log("file id", fileid)
        let fileExist;
        let filefromdb;

        if (true) {
            fileExist = await UploadedFile.findById(fileid)
            if (fileExist) {
                filefromdb = fileExist.fileData
            }
            else {
                res.status(404).json("error", "not found")
            }
        }
        // Set the appropriate headers
        const cleanFilename = filefromdb.name.replace(/\s/g, '_'); // Replace spaces with underscores
        res.setHeader('Content-Disposition', `inline; filename="${cleanFilename}"`);
        res.setHeader('Content-Type', filefromdb.mimetype);
        // res.setHeader('Content-Disposition', `inline; filename="${filefromdb.name}"`);
        // console.log(filefromdb.name)

        // Dynamically set the document title
        res.setHeader('Content-Disposition', `inline; filename="${cleanFilename}"`);
        // res.write(`<head><title>${cleanFilename}</title></head><body>`);

        // Send the file buffer as the response
        // res.write(filefromdb.mimetype);
        // res.end('</body></html>');

        // Send the file buffer as the response
        const imageResp = Buffer(filefromdb.data.split("base64,")[1], "base64");
        // console.log(imageResp)
        res.status(200).send(imageResp);
        // res.json({filefolder, file: filefromdb})

    }
    else {
        res.status(404).json("error", "not found")
    }
}