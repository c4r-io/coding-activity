import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import React from 'react'
import {
    MdKeyboardArrowDown,
    MdKeyboardArrowUp,
    MdKeyboardArrowLeft,
    MdKeyboardArrowRight,
} from "react-icons/md";
import EditTextContentElementWrapper from './editors/EditTextContentElementWrapper';

const DrawerArround = ({ children }) => {
    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    const [openLeft, setOpenLeft] = React.useState(uiData.devmode)
    const [openRight, setOpenRight] = React.useState(uiData.devmode)
    const [openBottom, setOpenBottom] = React.useState(uiData.devmode)
    return (
        <div>
            <div className='flex'>
                <div className={`relative ${openLeft ? 'w-[125px]' : 'w-[36px]'}`}>
                    <button className='expando absolute py-2 left-0 top-0 w-5 h-full bg-ui-violet text flex flex-col justify-between'
                        onClick={() => {
                            if (!uiData.devmode) {
                                setOpenLeft(cur => !cur)
                            }
                        }
                        }>
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
                    <EditTextContentElementWrapper
                        className={`ml-5 w-[105px] p-[2.5px] text-center flex items-center justify-between h-full`}
                        path={"editorview.plotLeftLabel"}
                    >
                        <div className={`ml-5 ${openLeft ? 'w-[105px] p-[2.5px] text-center flex items-center justify-between h-full' : 'hidden'}`}>
                            {uiData?.uiContent?.editorview?.plotLeftLabel}
                        </div>
                    </EditTextContentElementWrapper>
                </div>
                <div>{children}</div>
                <div className={`relative ${openRight ? 'w-[125px]' : 'w-[36px]'}`}>
                    <button className='expando absolute py-2 right-0 top-0 w-5 h-full bg-ui-violet text flex flex-col justify-between'
                        onClick={() => {
                            if (!uiData.devmode) {
                                setOpenRight(cur => !cur)
                            }
                        }
                        }>
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


                    <EditTextContentElementWrapper
                        className={`mr-5 w-[105px] p-[2.5px] text-center flex items-center justify-between h-full`}
                        path={"editorview.plotRightLabel"}
                    >
                        <div className={`mr-5 ${openRight ? 'w-[105px] p-[2.5px] text-center flex items-center justify-between h-full' : 'hidden'}`}>
                        {uiData?.uiContent?.editorview?.plotRightLabel}
                        </div>
                    </EditTextContentElementWrapper>
                </div>
            </div>
            <div className={` expando ${openLeft ? 'ml-[125px]' : 'ml-[22px]'} ${openRight ? 'mr-[125px]' : 'mr-[20px]'}`}>


                <EditTextContentElementWrapper
                    className={`text-wrap text-center p-2`}
                    path={"editorview.plotBottomLabel"}
                >
                    <div className={`${openBottom ? '' : 'hidden'} text-wrap text-center p-2`}>
                    {uiData?.uiContent?.editorview?.plotBottomLabel}
                    </div>
                </EditTextContentElementWrapper>
                <button
                    className="px-2 w-full flex justify-between items-center bg-ui-violet text"
                    onClick={() => {
                        if (!uiData.devmode) {
                            setOpenBottom(cur => !cur)
                        }
                    }}
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