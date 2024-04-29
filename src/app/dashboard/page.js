import Sidebar from "@/components/Sidebar";

const Page = () => {
  return (
  <>
    <Sidebar />
    <div className="p-4 sm:ml-64 bg-gray-700 min-h-screen">
      <div className="p-4 border-2 border-dashed rounded-lg border-gray-600">
        <div className="container mx-auto py-4 px-4 md:px-0">
          <div>Welcome to dashboard</div>

        </div>
      </div>
    </div>
  </>
  )
};
export default Page;
