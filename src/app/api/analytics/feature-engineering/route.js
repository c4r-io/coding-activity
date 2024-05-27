import connectMongoDB from '@/config/connectMongoDB.js';
import Analytics from '@/models/analyticsModel';

export async function GET(req, res) {
    await connectMongoDB();
    const pageSize = Number(req.nextUrl.searchParams.get('pageSize')) || 30;
    const page = Number(req.nextUrl.searchParams.get('pageNumber')) || 1;
    const count = await Analytics.countDocuments({});
    const findFromDbApi = Analytics.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    const results = await findFromDbApi.exec();
    return Response.json({
        results,
        page,
        pages: Math.ceil(count / pageSize)
    }, {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}

export async function POST(req) {
    const body = await req.json();
    await connectMongoDB();
    if (body.featureEngineeredDatas) {
        for (const item of body.featureEngineeredDatas) {
            const analyticsById = await Analytics.findById(item._id);
            if (!analyticsById) {
                continue;
            }
            analyticsById.featureEngineeredData = item.featureEngineeredData;
            console.log(analyticsById.featureEngineeredData);
            await analyticsById.save();
        }
        const findFromDbApi = await Analytics.find({})

        return Response.json({ msg: "Data updated",findFromDbApi });
    }
    return Response.json({ msg: "provide data to save" }, { status: 400 });
}
