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
        <div className='w-full'>
            <div className='w-full relative flex justify-stretch'>
                <div className={`relative ${openLeft ? 'w-[125px]' : 'w-[20px]'}`}>
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
                        className={`drawer-view-plot-left-label-visible`}
                        path={"editorview.plotLeftLabel"}
                    >
                        <div className={`${openLeft ? 'drawer-view-plot-left-label-visible' : 'drawer-view-plot-left-label-hidden'}`}>
                            {uiData?.uiContent?.editorview?.plotLeftLabel}
                        </div>
                    </EditTextContentElementWrapper>
                </div>
                <div >{children}</div>
                <div className={`relative ${openRight ? 'w-[125px]' : 'w-[20px]'}`}>
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
                        className={`drawer-view-plot-right-label-visible`}
                        path={"editorview.plotRightLabel"}
                    >
                        <div className={`${openRight ? 'drawer-view-plot-right-label-visible' : 'drawer-view-plot-right-label-hidden'}`}>
                        {uiData?.uiContent?.editorview?.plotRightLabel}
                        </div>
                    </EditTextContentElementWrapper>
                </div>
            </div>
            <div className={` expando ${openLeft ? 'ml-[125px]' : 'ml-[22px]'} ${openRight ? 'mr-[125px]' : 'mr-[20px]'}`}>


                <EditTextContentElementWrapper
                    className={`drawer-view-plot-bottom-label`}
                    path={"editorview.plotBottomLabel"}
                >
                    <div className={`${openBottom ? 'drawer-view-plot-bottom-label' : 'hidden'} `}>
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