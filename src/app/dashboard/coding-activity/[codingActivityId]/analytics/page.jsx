import React from 'react'
import dynamic from 'next/dynamic'  
const AnalyticsPage = dynamic(() => import('@/components/analytics/AnalyticsPage'), {
  ssr: false
});
async function getUsersList(params) {
  const res = await fetch(`${process.env.PRODUCTION_URL}/api/analytics?sort=${params.sortOrder == 1?"":"-"}${params.sortKey}&pageNumber=${params.pageNumber || 1}`, {
    cache: "no-store",
  })
  return res.json()
}
const Page = async ({ params, searchParams }) => {
  const sortOrder = searchParams.sortOrder || -1,
  sortKey = searchParams.sortKey || "uid",
  pageNumber = searchParams.pageNumber || 1;
  let analyticsList = null;
  try {
    analyticsList = await getUsersList({pageNumber, sortKey, sortOrder});
  } catch (error) {
    console.error(error)
  }
  return (
    <AnalyticsPage analyticsListData={analyticsList} params={params} searchParams={searchParams}></AnalyticsPage>
  )
}

export default Page