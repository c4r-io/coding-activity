import dynamic from 'next/dynamic'
const Homepage = dynamic(() => import('@/components/Homepage'), {
  ssr: false,
})
export default function Home() {
  return (
    <div className="bg--gray-700">
      <div className="flex justify-center items-center h-screen w-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white">
        <Homepage/>
      </div>
    </div>
  );
}
