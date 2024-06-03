import { useUploadImage } from '@/components/hooks/ApiHooks';
import { UiDataContext } from '@/contextapi/code-executor-api/UiDataProvider';
import debouncer from '@/utils/debouncer';
import Link from 'next/link';
import React, { useState } from 'react';
import { MdCloudUpload, MdDelete } from 'react-icons/md';
import StringArrayInput from '../StringArrayInput';

const SidebarContentEditor = () => {
    const [mystmd, setMystmd] = useState('');

    const handleMystmdChange = (e) => {
        setMystmd(e.target.value);
    };

    const handleSave = () => {
        // Implement your save logic here
        console.log('Saving mystmd:', mystmd);
    };

    const { uiData, dispatchUiData } = React.useContext(UiDataContext);
    // State to store the base64 string
    const getDefaultData = () => {
        if (uiData?.activePath) {
            const splittedPath = uiData?.activePath?.path.split(".");
            const nd = splittedPath.reduce((acc, curr) => {
                if (curr) {
                    if (curr.includes('[')) {
                        const index = curr.split('[')[1].split(']')[0]
                        return acc?.[curr.split('[')[0]][index]
                    }
                    return acc?.[curr];
                }
                return acc;
            }, uiData?.uiContent)
            return nd
        } else {
            return ''
        }
    }
    return (
        <div>
            {uiData?.activePath &&
                <>
                    <h4 className='text-xl'>Settings</h4>
                    {
                        uiData?.activePath?.type === 'text' &&
                        <div>
                            <h4 className='text-lg'>Edit content</h4>
                            <textarea
                                className={`bg-white text-black w-full h-40 p-1 rounded-sm`}
                                value={getDefaultData()}
                                onChange={(e) => {
                                    dispatchUiData({ type: 'setContent', payload: { key: uiData?.activePath?.path, data: e.target.value } })
                                }}
                                defaultValue={getDefaultData()}
                            />
                        </div>
                    }
                    {
                        uiData?.activePath?.type === 'image' &&
                        <div>
                            <h4 className='text-lg'>Edit image </h4>
                            <div className='w-full p-4'>
                                <div className='flex justify-center items-center w-[160px] h-[160px]'>
                                    <img className=' max-w-[160px] max-h-[160px]' src={getDefaultData()} alt="image" />
                                </div>
                            </div>
                            <div className='w-full'>
                                <textarea
                                    className={`bg-white text-black w-full p-1 rounded-sm`}
                                    value={getDefaultData()}
                                    onChange={(e) => {
                                        dispatchUiData({ type: 'setContent', payload: { key: uiData?.activePath?.path, data: e.target.value } })
                                    }}
                                    defaultValue={getDefaultData()}
                                />
                            </div>
                            <div className='flex flex-wrap -m-1'>
                                <div className='p-1'>
                                    <Link href={`/dashboard/files-browser?fileSelector=true`} >
                                        <button className='px-3 py-1 bg-ui-violet text-base text-white'>
                                            Brows Files
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    }
                    {
                        uiData?.activePath?.type === 'annotation' &&
                        <div>
                            <h4 className='text-lg'>Edit annotation </h4>
                            <div>
                                <div className='w-full'>
                                    <textarea
                                        className={`bg-white text-black w-full p-1 rounded-sm`}
                                        value={getDefaultData()?.innerText}
                                        onChange={(e) => {
                                            dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.innerText`, data: e.target.value } })
                                        }}
                                        defaultValue={getDefaultData()?.innerText}
                                    />
                                </div>

                                <div className='text-xs'>
                                    <div className='p-1 flex items-center  text-white'>
                                        <div className="w-2/5">Text </div>
                                        <input className='w-3/5 ml-1 rounded'
                                            type='color'
                                            value={getDefaultData()?.messageBoxTextColor}
                                            onChange={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.messageBoxTextColor`, data: e.target.value } })
                                            }}
                                        >
                                        </input>
                                    </div>
                                    <div className='p-1 flex items-center  text-white'>
                                        <div className="w-2/5">BG</div>
                                        <input className='w-3/5 ml-1 rounded'
                                            type='color'
                                            value={getDefaultData()?.messageBoxBgColor}
                                            onChange={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.messageBoxBgColor`, data: e.target.value } })
                                            }}
                                        >
                                        </input>
                                    </div>
                                    <div className='p-1 flex items-center  text-white'>
                                        <div className="w-2/5">Font Scale</div>
                                        <input className='w-3/5 ml-1 bg-gray-300 text-black px-2 py-1 rounded'
                                            type='number'
                                            value={getDefaultData()?.fontSize}
                                            onChange={(e) => {
                                                dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}.fontSize`, data: e.target.value } })
                                            }}
                                        >
                                        </input>
                                    </div>
                                </div>
                                <button className='p-1 bg-red-500 rounded-lg text-xl cursor-pointer'
                                    onClick={() => {
                                        dispatchUiData({ type: 'deleteContent', payload: { key: `${uiData?.activePath?.path}` } });
                                    }}
                                >
                                    <MdDelete />
                                </button>
                            </div>
                        </div>
                    }
                    {
                        uiData?.activePath?.type === 'stringArray' &&
                        <div>
                            <h4 className='text-lg'>Edit default questions</h4>
                            <div>
                                <StringArrayInput
                                    defaultValues={getDefaultData()}
                                    onUpdate={(e) => {
                                        dispatchUiData({ type: 'setContent', payload: { key: `${uiData?.activePath?.path}`, data: e } });
                                    }}
                                />
                            </div>
                        </div>
                    }
                    {/* <button onClick={handleSave}>Save</button> */}
                </>
            }
        </div>
    );
};

export default SidebarContentEditor;