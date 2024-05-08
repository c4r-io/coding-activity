import Sidebar from '@/components/Sidebar'
import Link from 'next/link'
import React from 'react'

const Page = ({ params }) => {
    return (
        <>
            <Sidebar />
            <div className="p-4 sm:ml-64 bg-gray-700 min-h-screen">
                <div className="p-4 border-2 border-dashed rounded-lg border-gray-600">
                    <div className="container mx-auto py-4 px-4 md:px-0">
                        <div>
                            <Link href={`/dashboard/coding-activity/${params.codingActivityId}/submissions/code-executor-issue-list`}>
                                <button className="me-2 px-4 py-2 bg-yellow-500 text-white rounded-md mb-4 "
                                >Issue List</button>
                            </Link>
                            <Link href={`/dashboard/coding-activity/${params.codingActivityId}/submissions/chat-feedback`}>
                                <button className="me-2 px-4 py-2 bg-yellow-500 text-white rounded-md mb-4 "
                                >Feedback List</button>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Page