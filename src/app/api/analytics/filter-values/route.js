import connectMongoDB from '@/config/connectMongoDB.js';
import Analytics from '@/models/analyticsModel';
// @desc Get all videoClipLists
// @route GET api/videoClipLists
// @acess Privet
export async function GET(req, res) {
  let keywords = {};
  if (req.nextUrl.searchParams.get('filterKey')) {
    keywords.filterKey = req.nextUrl.searchParams.get('filterKey');
  }else{
    return Response.json({
      message: "filterKey is required"
    });
  }
  await connectMongoDB();
  const findFromDbApi = Analytics.find().select(keywords.filterKey);
  const data = await findFromDbApi.exec();
  const onlyvalues = data.map((item) => {
    const keys = keywords.filterKey.split('.');
    const value1 = keys.reduce((acc, cur) => acc && acc[cur], item);
    return value1
  }).filter((item) => item);
  const results = new Set(onlyvalues);

  return Response.json({
    results: Array.from(results),
  });
}