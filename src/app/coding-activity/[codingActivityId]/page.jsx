import dynamic from 'next/dynamic'

const CodeExecutorActivityView = dynamic(() => import('@/components/coding-activity/CodeExecutorActivityView'), {
  ssr: false,
})
// get data server side and render it on client side
const getCodeExecutorActivityData = async (id) => {
  const res = await fetch(`${process.env.PRODUCTION_URL}/api/coding-activity/${id}`, {
    // next: { revalidate: 1 },
    cache: 'no-store'
  })
  if (!res.ok) {
    return {}
  }
  return res.json()
}
const Page = async ({ params }) => {
  let data;
  try {
    const response = await getCodeExecutorActivityData(params.codingActivityId)
    data = response.results
    // console.log('response ', data)
  } catch (error) {
    console.log("error getting styles", error)
  }

  return (
    <div className="container mx-auto py-4 px-4 md:px-0">
      <CodeExecutorActivityView codingActivityId={params.codingActivityId} uiDataFromDb={data} />
    </div>
  );
};
export default Page;
