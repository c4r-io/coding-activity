import connectMongoDB from "@/config/connectMongoDB";
import mongodbClient from "@/config/mongodbClient";
import AnalyticsDynamicModel from "@/models/analyticsDynamicModel";

export async function POST(req) {
    const body = await req.json();
    const client = await mongodbClient;
    const db = client.db();
    const analyticsdynamicmodel = await db
        .collection("analyticsdynamicmodels")
        .insertOne({_id:"6654575d489704b67de138cf"},{...body.datatosave});

    // await connectMongoDB();
    // const dataToSave = body.datatosave;
    return Response.json({...analyticsdynamicmodel });
    if (dataToSave) {
        const createdAnalytics = await AnalyticsDynamicModel(dataToSave).create({
            ...dataToSave
        });
        return Response.json({ ...createdAnalytics._doc });
    } else {
        return Response.json({ msg: "provide data to savee" })
    }
}