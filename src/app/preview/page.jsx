import dynamic from 'next/dynamic'
import React from 'react'
// const EditorLayout = dynamic(() => import('@/components/customLayouts/EditorLayout'), {
//     ssr: false
//     });
const page = () => {
  return (
    <div>
      {/* <EditorLayout/> */}
      <div className='bg-yellow-300 w-56 h-52 overflow-hidden'>
        <div className='relative left-10 bg-red-500 w-56 h-52'>

        </div>
      </div>
      </div>
  )
}

export default page