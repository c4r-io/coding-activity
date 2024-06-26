import dynamic from 'next/dynamic'

const Sidebar = dynamic(() => import('@/components/Sidebar'), {
  ssr: false,
})
const CodeExecutorItemsUi = dynamic(() => import('@/components/coding-activity/CodeExecutorItemsUi'), {
  ssr: false,
})
// const { CodeExecutorItemsUi } = CodeExecutorUiComponents;

const getCodeExecutorActivityList = async () => {
  const res = await fetch(`${process.env.PRODUCTION_URL}/api/coding-activity`, {
    // next: { revalidate: 1 },
    cache: 'no-store'
  })
  if (!res.ok) {
    return {}
  }
  return res.json()
}
const Page = async ({ searchParams }) => {
  let data;
  try {
    data = await getCodeExecutorActivityList()
  } catch (error) {
    console.error("error getting styles", error)
  }
  return (
    <>
      <Sidebar data={data}/>
      <div className="p-4 sm:ml-64 bg-gray-700 min-h-screen">
        <div className="p-4 border-2 border-dashed rounded-lg border-gray-600">
          <div className="container mx-auto py-4 px-4 md:px-0">
            <CodeExecutorItemsUi searchParams={searchParams} data={data} />
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;
