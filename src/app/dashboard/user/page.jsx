import React from 'react'
import dynamic from 'next/dynamic'
import Sidebar from '@/components/Sidebar'

const UserListPage = dynamic(() => import('./UserListPage'), {
  ssr: false,
})
const Page = () => {
  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 bg-gray-700 min-h-screen">
        <div className="p-4 border-2 border-dashed rounded-lg border-gray-600">
          <div className="container mx-auto py-4 px-4 md:px-0">
            <UserListPage />
          </div>
        </div>
      </div>
    </>
  )
}

export default Page