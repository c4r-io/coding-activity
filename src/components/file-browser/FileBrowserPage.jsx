"use client"
import React from 'react'
import LayoutComponent from '@/components/customLayouts/LayoutComponent'
import Sidebar from '@/components/Sidebar';
import { FaRegCopy } from "react-icons/fa";
import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react'
import { MdOutlineCheckBoxOutlineBlank, MdOutlineCheckBox, MdCloudUpload } from "react-icons/md";
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useUploadImage } from '../hooks/ApiHooks';
import { MdDelete } from "react-icons/md";
import { set } from 'lodash';
const FileBrowserPage = ({ filesData, searchParams }) => {
    const router = useRouter();
    const [isLeftSidebarOpen, setIsLeftSidebarOpen] = React.useState(true);
    const [isRightSidebarOpen, setIsRightSidebarOpen] = React.useState(true);
    const [filePopup, setFilePopup] = React.useState(false)
    const [choosenFiles, setChoosenFiles] = React.useState([])
    const fileSelector = searchParams.fileSelector ? searchParams.fileSelector : false

    const handleChooseFile = (file) => {
        if (fileSelector) {
            setChoosenFiles([file._id])
        } else {
            console.log('file ', choosenFiles.includes(file._id))
            if (choosenFiles.includes(file._id)) {
                setChoosenFiles(choosenFiles.filter((f) => f !== file._id))
            }
            else {
                setChoosenFiles([...choosenFiles, file._id])
            }
        }
    }
    const handleFileSelectionDone = () => {
        console.log('choosenFiles ', choosenFiles)
        if (fileSelector) {
            // copy to clipboard
            // window.navigator.clipboard.writeText(`/api/public/${choosenFiles[0]}`);
            sessionStorage.setItem('choosenFiles', `/api/public/${choosenFiles[0]}`)
        }
        router.back()
    }
    const copyFilePath = (id) => {
        console.log('id ', `/api/public/${id}`)
        toast.success('File path copied to clipboard')
        navigator.clipboard.writeText(`/api/public/${id}`);
    }


    const uploadImageHook = useUploadImage();
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            const data = new FormData();
            data.append('image', file);
            await uploadImageHook.upload(data, (d) => {
                // success callback
                console.log("uploaded data: ", d)
                location.reload()
            }, (e) => {
                // error callback
                console.log("error: ", e)
            });
        }
    };
    const [deletePopup, setDeletePopup] = React.useState(false)
    const [deleteList, setDeleteList] = React.useState([])
    const handleDelete = async (file) => {
        setDeletePopup(true)
        setDeleteList([file._id])
    }
    return (
        <div>
            <LayoutComponent
                isLeftSidebarOpen={isLeftSidebarOpen}
                isRightSidebarOpen={isRightSidebarOpen}
            >
                {/* <LayoutComponent.Header>
              <div className='flex justify-between content-center p-1 w-full h-full'>
                <button onClick={toggleLeftSidebar}>
                  {isLeftSidebarOpen ? <IoMdMenu /> : <RiMenuUnfoldLine />}
                </button>
                <div>Content</div>
                <button onClick={toggleRightSidebar}>
                  {isRightSidebarOpen ? <IoMdMenu /> : <RiMenuFoldLine />}
                </button>
              </div>
            </LayoutComponent.Header> */}
                <LayoutComponent.LeftSidebar>
                    <div className="p-1 w-full h-full bg-gray-800 text-white">
                        <Sidebar />
                    </div>
                </LayoutComponent.LeftSidebar>
                <LayoutComponent.RightSidebar>
                    <div className="p-2 w-full h-full bg-gray-800 text-white">
                        <div className='flex -m-1'>
                            <div className='p-1'>
                                <div className='relative !cursor-pointer'>
                                    <input className='w-full opacity-0 h-full absolute top-0 left-0 z-40 !cursor-pointer' type="file" accept="image/*" onChange={handleFileChange}
                                    />
                                    <button className='px-3 py-1 bg-ui-violet text-base text-white inline-flex justify-center items-center'>
                                        <span className='me-1'>Upload</span> <MdCloudUpload />
                                    </button>
                                </div>
                            </div>
                            <div className='p-1'>
                                <button className='px-3 py-1 bg-ui-violet text-base rounded-sm'
                                    onClick={handleFileSelectionDone}
                                >
                                    Done
                                </button>
                            </div>
                            {!fileSelector && choosenFiles.length > 0 &&
                                <div className='p-1'>
                                    <button className='px-3 py-1 bg-red-600 text-base rounded-sm'>Delete</button>
                                </div>
                            }
                        </div>
                    </div>
                </LayoutComponent.RightSidebar>
                <LayoutComponent.Main>
                    <div className='p-2'>

                        <div className='text-white'>
                            <div className='flex justify-start flex-wrap -m-1'>
                                {
                                    filesData?.map((file, index) => {
                                        return (
                                            <div key={index} className='p-1'>
                                                <div className="relative w-[160px] bg-white border border-gray-200 rounded-lg shadow flex flex-col justify-center items-center"
                                                    title={file?.fileData?.name}
                                                >
                                                    <div className='absolute top-0 right-0'>
                                                        <div className='flex -m-0.5'>
                                                            <div className='p-0.5'>
                                                                <div className='p-1 bg-red-500 rounded-lg text-xl cursor-pointer'

                                                                    onClick={() => handleDelete(file)}
                                                                >
                                                                    <MdDelete />
                                                                </div>
                                                            </div>
                                                            {/* <div className='p-0.5'>
                                                                <div className='p-1 bg-black rounded-lg text-xl cursor-pointer'

                                                                    onClick={() => handleChooseFile(file)}
                                                                >
                                                                    {choosenFiles.length > 0 && choosenFiles.includes(file._id) ?
                                                                        <MdOutlineCheckBox />
                                                                        :
                                                                        <MdOutlineCheckBoxOutlineBlank />
                                                                    }
                                                                </div>
                                                            </div> */}
                                                            <div className='p-0.5'>
                                                                <div className='p-1 bg-black rounded-lg text-xl cursor-pointer'

                                                                    onClick={() => copyFilePath(file._id)}
                                                                >
                                                                    <FaRegCopy />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div
                                                        className='cursor-pointer'
                                                        onClick={() => setFilePopup(file)}
                                                    >

                                                        <div className='w-[150px] h-[150px] overflow-hidden flex justify-center items-center'>
                                                            <img className="rounded-t-lg" src={`/api/public/${file._id}`} alt="" />
                                                        </div>
                                                        <div className="p-5">
                                                            <p className="text-xs font-bold tracking-tight text-gray-900">
                                                                {file?.fileData?.name.substring(0, 15)}{file?.fileData?.name.length > 15 ? '...' : ''}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                    )
                                }
                            </div>
                            <Transition appear show={Boolean(filePopup)}>
                                <Dialog as="div" className="relative z-10 focus:outline-none" onClose={() => { setFilePopup(false) }}>
                                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                        <div className="flex min-h-full items-center justify-center p-4">
                                            <TransitionChild
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 transform-[scale(95%)]"
                                                enterTo="opacity-100 transform-[scale(100%)]"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 transform-[scale(100%)]"
                                                leaveTo="opacity-0 transform-[scale(95%)]"
                                            >
                                                <DialogPanel className="w-full max-w-md rounded-xl bg-white/50 p-6 backdrop-blur-2xl">
                                                    <div className='flex justify-center items-center flex-col'>

                                                        <img className='mb-2' src={`/api/public/${filePopup?._id}`} alt="" />
                                                        <Button
                                                            className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                                            onClick={() => { setFilePopup(false) }}
                                                        >
                                                            Close
                                                        </Button>
                                                    </div>
                                                </DialogPanel>
                                            </TransitionChild>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>
                            <Transition appear show={Boolean(deletePopup)}>
                                <Dialog as="div" className="relative z-10 focus:outline-none" onClose={() => { setDeletePopup(false) }}>
                                    <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
                                        <div className="flex min-h-full items-center justify-center p-4">
                                            <TransitionChild
                                                enter="ease-out duration-300"
                                                enterFrom="opacity-0 transform-[scale(95%)]"
                                                enterTo="opacity-100 transform-[scale(100%)]"
                                                leave="ease-in duration-200"
                                                leaveFrom="opacity-100 transform-[scale(100%)]"
                                                leaveTo="opacity-0 transform-[scale(95%)]"
                                            >
                                                <DialogPanel className="w-full max-w-md rounded-xl bg-white/50 p-6 backdrop-blur-2xl">
                                                    <div className='flex justify-center items-center flex-col'>
                                                        <DialogTitle as="h3" className="text-base/7 font-medium text-black mb-3">
                                                            Are you sure?
                                                        </DialogTitle>
                                                        <div className='flex -m-1'>
                                                            <div className='p-1'>
                                                                <Button
                                                                    className="inline-flex items-center gap-2 rounded-md bg-red-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-red-600 data-[open]:bg-red-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                                                    onClick={() => {
                                                                        uploadImageHook.remove(deleteList, () => {
                                                                            location.reload(),
                                                                            setDeletePopup(false)
                                                                        })
                                                                    }}
                                                                >
                                                                    {uploadImageHook.loading ? 'Deleting...' : 'Delete'}
                                                                </Button>
                                                            </div>
                                                            <div className='p-1'>
                                                                <Button
                                                                    className="inline-flex items-center gap-2 rounded-md bg-gray-700 py-1.5 px-3 text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
                                                                    onClick={() => { setDeletePopup(false) }}
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </DialogPanel>
                                            </TransitionChild>
                                        </div>
                                    </div>
                                </Dialog>
                            </Transition>
                        </div>
                    </div>
                </LayoutComponent.Main>
            </LayoutComponent>
        </div>
    )
}

export default FileBrowserPage