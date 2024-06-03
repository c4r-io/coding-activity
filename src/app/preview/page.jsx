import dynamic from 'next/dynamic'
import React from 'react'
const EditorLayout = dynamic(() => import('@/components/customLayouts/EditorLayout'), {
    ssr: false
    });
const page = () => {
  return (
    <div><EditorLayout/></div>
  )
}

export default page