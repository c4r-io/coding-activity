import dynamic from 'next/dynamic'

const FileBrowserPage = dynamic(() => import('@/components/file-browser/FileBrowserPage'), {
    ssr: false,
})

// get data server side and render it on client side
const getUploadedFiles = async (id) => {
    const res = await fetch(`${process.env.PRODUCTION_URL}/api/upload`, {
        // next: { revalidate: 1 },
        cache: 'no-store'
    })
    //   console.log('res ', res)
    if (!res.ok) {
        return {}
    }
    return res.json()
}
const Page = async ({ params, searchParams }) => {
    let data;
    try {
        const response = await getUploadedFiles(params.codingActivityId)
        data = response.results
        // console.log('response ', data)
    } catch (error) {
        console.error("error getting styles", error)
    }

    return (
        <FileBrowserPage searchParams={searchParams} filesData={data} />
    );
};
export default Page;
