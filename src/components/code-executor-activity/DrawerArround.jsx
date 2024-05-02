import React from 'react'
import {
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
} from "react-icons/md";

const DrawerArround = ({ children }) => {
    const [openLeft, setOpenLeft] = React.useState(false)
    const [openRight, setOpenRight] = React.useState(false)
    const [openBottom, setOpenBottom] = React.useState(false)
    return (
        <div>
            <div className='flex'>
                <div className={`relative ${openLeft?'w-[125px]':'w-[36px]'}`}>
                    <button className='expando absolute py-2 left-0 top-0 w-5 h-full bg-ui-violet text flex flex-col justify-between' onClick={() => setOpenLeft(cur => !cur)}>
                        <div className='text-lg'>
                            {openLeft ?
                                <MdKeyboardArrowRight />
                                :
                                <MdKeyboardArrowLeft />
                            }
                        </div>
                        <div className=' rotate-90 text-[10px]'>{!openLeft ? "Open" : "Close"}</div>
                        <div className='text-lg'>
                            {openLeft ?
                                <MdKeyboardArrowRight />
                                :
                                <MdKeyboardArrowLeft />
                            }
                        </div>
                    </button>
                    <div className={`ml-5 ${openLeft ? 'w-[105px] p-[2.5px] text-center flex items-center h-full' : 'hidden'}`}>
                    This axis shows you how many blocks into which your patients have been randomized
                    </div>
                </div>
                <div>{children}</div>
                <div className={`relative ${openRight?'w-[125px]':'w-[36px]'}`}>
                    <button className='expando absolute py-2 right-0 top-0 w-5 h-full bg-ui-violet text flex flex-col justify-between' onClick={() => setOpenRight(cur => !cur)}>
                        <div className='text-lg'>
                            {openRight ?
                                <MdKeyboardArrowLeft />
                                :
                                <MdKeyboardArrowRight />
                            }
                        </div>
                        <div className=' rotate-90 text-[10px]'>{!openRight ? "Open" : "Close"}</div>
                        <div className='text-lg'>
                            {openRight ?
                                <MdKeyboardArrowLeft />
                                :
                                <MdKeyboardArrowRight />
                            }
                        </div>
                    </button>
                    <div className={`mr-5 ${openRight ? 'w-[105px] p-[2.5px] text-center flex items-center h-full' : 'hidden'}`}>This legend shows a different color for each treatment</div>
                </div>
            </div>
            <div className={` expando ${openLeft?'ml-[125px]':'ml-[22px]'} ${openRight?'mr-[125px]':'mr-[20px]'}`}>
                <div className={`${openBottom?'':'hidden'} text-wrap text-center p-2`}>
                    This axis shows you the sequence of the treatments within each block
                </div>
                <button
                    className="px-2 w-full flex justify-between items-center bg-ui-violet text"
                    onClick={() => setOpenBottom(cur => !cur)}
                >
                    <div className="w-[30px] flex justify-center text-lg">
                        {openBottom ? (
                            <MdKeyboardArrowDown />
                        ) : (
                            <MdKeyboardArrowUp />
                        )}
                    </div>
                    <p className="text-center text-[10px]">
                        {!openBottom ? "Open" : "Close"}
                    </p>
                    <div className="w-[30px] flex justify-center text-lg">
                        {openBottom ? (
                            <MdKeyboardArrowDown />
                        ) : (
                            <MdKeyboardArrowUp />
                        )}
                    </div>
                </button>
            </div>
        </div>
    )
}

export default DrawerArround