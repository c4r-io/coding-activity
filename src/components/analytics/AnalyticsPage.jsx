'use client';
import { api } from '@/utils/apibase';
import Pagination from '@/components/Pagination.jsx';
import { getToken } from '@/utils/token';
import { toast } from 'react-toastify';
import { useContext, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserContext } from '@/contextapi/UserProvider';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { useDeleteByIds } from '@/components/hooks/ApiHooks';
import Sidebar from '@/components/Sidebar';
import { PieChart } from '@/components/coding-activity/chart/PieChart';
import SortBtnComponent from '@/components/SortBtnComponent';
const AnalyticsPage = ({ analyticsList, params, searchParams }) => {
  const sortOrder = searchParams.sortOrder || -1,
    sortKey = searchParams.sortKey || "permission";
  function getTrimedString(str, len = 50) {
    const arStr = str?.split(' ');
    let opStr = '';
    if (arStr?.length < 5) {
      return { content: `${str?.slice(0, len)} `, isTrimed: str.length > len };
    }
    if (arStr) {
      for (const iterator of arStr) {
        const testOpStr = opStr + ' ' + iterator;
        if (testOpStr.length < len) {
          opStr = testOpStr;
        } else {
          break;
        }
      }
      return { content: `${opStr} `, isTrimed: str.length > len };
    } else {
      return { content: ` `, isTrimed: false };
    }
  }
  const { userData, dispatchUserData } = useContext(UserContext);
  const router = useRouter();
//   const [analyticsList, setAnalyticsList] =
//     useState({
//       page: 1,
//       pages: 1,
//       results: null,
//       analytics: null,
//     });
  const [page, setPage] = useState(searchParams.page || 1);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [analyticsKey, setAnalyticsKey] = useState("device");
  const [deleteList, setDeleteList] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [listLoading, setListLoading] = useState(false);

  const getpythonExecutorIssueListsList = async (page) => {
    dispatchUserData({ type: 'checkLogin' });
    const config = {
      method: 'GET',
      url: '/api/analytics',
      headers: {
        Authorization: `Bearer ${getToken('token')}`,
      },
      params: {
        pageNumber: page,
        codingActivity: params.codingActivityId,
        select: '',
        analyticsKey: analyticsKey,
      },
    };
    setListLoading(true);
    try {
      const response = await api.request(config);
    //   setAnalyticsList(response.data);
      console.log(response.data);
      setListLoading(false);
    } catch (error) {
      console.log(error);
      setListLoading(false);
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ', Login to try again.', {
          position: 'top-center',
        });
        router.push('/');
      } else {
        toast.error(error.message, {
          position: 'top-center',
        });
      }
    }
  };
  const createSamplePythonExecutorIssueList = async () => {
    dispatchUserData({ type: 'checkLogin' });
    const config = {
      method: 'post',
      url: '/api/analytics',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${getToken('token')}`,
      },
      data: {
        description: 'Sample Description',
        codingActivity: params.codingActivityId
      },
    };
    setCreateLoading(true);
    try {
      const response = await api.request(config);
      console.log(response.data);
      setCreateLoading(false);
      router.push(`/dashboard/coding-activity/${params.codingActivityId}/code-executor-issue-list/${response.data._id}`);
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + '. Login to try again.', {
          position: 'top-center',
        });
        router.push('/');
      } else {
        toast.error(error.message, {
          position: 'top-center',
        });
      }
      console.error(error);
      setCreateLoading(false);
    }
  };
  const apiDeleteByIdHook = useDeleteByIds("/api/analytics");
  const handleDelete = async () => {
    apiDeleteByIdHook.deleteByIds(deleteList,
      () => {
        // success callback
        setDeletePopup(false);
        getpythonExecutorIssueListsList(page);
        setDeleteList([]);
      },
      () => {
        // error callback
        setDeletePopup(false);
      })
  }

  const deleteConfirmDialog = (id) => {
    setDeleteId(id);
    setDeletePopup(true);
  };

  const onpageChange = (e) => {
    setPage(Number(e));
    // router.push({ query: { page: e } });
  };
  useEffect(() => {
    getpythonExecutorIssueListsList(page);
  }, [page, analyticsKey]);


  const toggleAddToDeleteList = (id) => {
    if (deleteList.includes(id)) {
      setDeleteList(deleteList.filter((item) => item !== id));
    } else {
      setDeleteList([...deleteList, id]);
    }
  }
  const toggleSelectAll = () => {
    if (deleteList.length === analyticsList?.results?.length) {
      setDeleteList([]);
    } else {
      setDeleteList(analyticsList?.results?.map((item) => item._id));
    }
  }
  const optionsArray = [
    { key: "totalDurationInSeconds", value: "Total Duration In Seconds" },
    { key: "uid", value: "UID" },
    { key: "ip", value: "IP" },
    { key: "ipinfo.city", value: "City" },
    { key: "ipinfo.region", value: "Region" },
    { key: "ipinfo.country", value: "Country" },
    { key: "ipinfo.loc", value: "Loc" },
    { key: "ipinfo.org", value: "Org" },
    { key: "ipinfo.postal", value: "Postal" },
    { key: "ipinfo.timezone", value: "Timezone" },
    { key: "browser", value: "Browser" },
    { key: "device", value: "Device" },
    { key: "aspectRatio", value: "Aspect Ratio" },
  ];

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 bg-gray-700 min-h-screen">
        <div className="p-4 border-2 border-dashed rounded-lg border-gray-600">

          <div className="container mx-auto py-4 px-4 md:px-0">
            <div>
              <div className="w-full flex-col md:flex-row flex justify-center items-center">
                <PieChart data={analyticsList?.analytics || []} />

                <div className="mb-6">
                  <label
                    htmlFor="analyticsKey"
                    className="block mb-2 text-sm font-medium text-white"
                  >
                    Select a key ({optionsArray.find(e => e.key === analyticsKey)?.value})
                  </label>
                  <select
                    value={analyticsKey}
                    onChange={(e) => setAnalyticsKey(e.target.value)}
                    id="analyticsKey"
                    className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option>Choose a analytics key</option>
                    {optionsArray.map((item, index) =>
                      <option key={index} value={item.key}>{item.value}</option>
                    )}
                    {/* <option value="totalDurationInSeconds">Total Duration In Seconds</option>
                    <option value="uid">UID</option>
                    <option value="ip">IP</option>
                    <option value="ipinfo.city">City</option>
                    <option value="ipinfo.region">Region</option>
                    <option value="ipinfo.country">Country</option>
                    <option value="ipinfo.loc">Loc</option>
                    <option value="ipinfo.org">Org</option>
                    <option value="ipinfo.postal">Postal</option>
                    <option value="ipinfo.timezone">Timezone</option>
                    <option value="browser">Browser</option>
                    <option value="device">Device</option>
                    <option value="screenWidth">Screen Width</option>
                    <option value="screenHeight">Screen Height</option> */}
                  </select>
                </div>
              </div>
              <div className="w-full flex justify-end pb-3 -m-1">
                <div className={`p-1 ${deleteList.length > 0 ? "block" : "hidden"}`}>
                  <button
                    type="button"
                    className="delete_button"
                    onClick={() => deleteConfirmDialog()}
                    disabled={apiDeleteByIdHook.loading}
                  >
                    Delete Selected
                  </button>
                </div>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs uppercase bg-gray-900 text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        <button
                          className={`${analyticsList?.results?.length == 0 ? 'pointer-events-none' : ''}`}
                          onClick={() => toggleSelectAll()}
                        >
                          {deleteList.length === analyticsList?.results?.length ?
                            <span className="text-ui-purple"><MdCheckBox /> </span> :
                            <MdCheckBoxOutlineBlank />
                          }
                        </button>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"uid"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          UID
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"time"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          Time
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"totalDurationInSeconds"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          Total Duration In Seconds
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"ip"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          IP
                        </SortBtnComponent>

                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"ipinfo.city"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          City
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"ipinfo.region"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          Region
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"ipinfo.country"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          Country
                        </SortBtnComponent>

                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"ipinfo.loc"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          Loc
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"ipinfo.org"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          Org
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"ipinfo.postal"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          Postal
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"ipinfo.timezone"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          Timezone
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"browser"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          Browser
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"device"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          Device
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"aspectRatio"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          AspectRatio
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3 text-right">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  {!listLoading && (
                    <tbody>
                      {analyticsList?.results?.map(
                        (item, index) => (
                          <tr
                            className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600"
                            key={index}
                          >
                            <td className="px-6 py-4">
                              <button
                                onClick={() => toggleAddToDeleteList(item._id)}
                              >
                                {deleteList.includes(item._id) ?
                                  <span className="text-ui-purple"><MdCheckBox /> </span> :
                                  <MdCheckBoxOutlineBlank />
                                }
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              {item?.uid}
                            </td>
                            <td className="px-6 py-4">
                              {item?.time[0]},
                              {item?.time[item.time.length - 1]}
                            </td>
                            <td className="px-6 py-4">
                              {item?.totalDurationInSeconds}
                            </td>
                            <td className="px-6 py-4">
                              {item?.ip}
                            </td>
                            <td className="px-6 py-4">
                              {item?.ipinfo?.city}
                            </td>
                            <td className="px-6 py-4">
                              {item?.ipinfo?.region}
                            </td>
                            <td className="px-6 py-4">
                              {item?.ipinfo?.country}
                            </td>
                            <td className="px-6 py-4">
                              {item?.ipinfo?.loc}
                            </td>
                            <td className="px-6 py-4">
                              {item?.ipinfo?.org}
                            </td>
                            <td className="px-6 py-4">
                              {item?.ipinfo?.postal}
                            </td>
                            <td className="px-6 py-4">
                              {item?.ipinfo?.timezone}
                            </td>
                            <td className="px-6 py-4">
                              {item?.browser}
                            </td>
                            <td className="px-6 py-4">
                              {item?.device}
                            </td>
                            <td className="px-6 py-4">
                              {item?.aspectRatio}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="inline-flex space-x-1 items-center text-base font-semibold text-white">
                                <button
                                  type="button"
                                  className="px-3 py-2 text-xs font-medium text-center inline-flex items-center text-white rounded-lg focus:ring-4 focus:outline-none bg-red-600 hover:bg-red-700 focus:ring-red-800"
                                  onClick={() => { deleteConfirmDialog(); setDeleteList([item._id]) }}
                                >
                                  <svg
                                    className="w-3 h-3 mr-1 text-white"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 18 20"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M1 5h16M7 8v8m4-8v8M7 1h4a1 1 0 0 1 1 1v3H6V2a1 1 0 0 1 1-1ZM3 5h12v13a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V5Z"
                                    />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ),
                      )}
                    </tbody>
                  )}
                </table>
                {analyticsList?.results?.length ==
                  0 ? (
                  <div className="text-white text-center">
                    No data to show
                  </div>
                ) : (
                  ''
                )}
                {listLoading && (
                  <div
                    className="z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0  h-full w-full flex justify-center items-center
  bg-gray-800"
                  >
                    <div className="flex items-center justify-center w-56 h-56">
                      <div role="status">
                        <svg
                          aria-hidden="true"
                          className="w-8 h-8 mr-2 animate-spin text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              {analyticsList?.pages > 0 && (
                <Pagination
                  activePage={page}
                  pageLength={analyticsList?.pages}
                  onpageChange={onpageChange}
                />
              )}
            </div>
            {deletePopup && (
              <div className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-50/50">
                <div className="relative w-full max-w-md max-h-full">
                  <div className="relative rounded-lg shadow bg-gray-700">
                    <button
                      type="button"
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                      data-modal-hide="popup-modal"
                      onClick={() => setDeletePopup(false)}
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                    <div className="p-6 text-center">
                      <svg
                        className="mx-auto mb-4 w-12 h-12 text-gray-200"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 20"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                        />
                      </svg>
                      <h3 className="mb-5 text-lg font-normal text-gray-400">
                        Are you sure you want to delete this analytics?
                      </h3>
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        className="text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                        onClick={() => handleDelete()}
                      >
                        Yes, I&apos;m sure
                      </button>
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600"
                        onClick={() => {
                          setDeletePopup(false);
                        }}
                      >
                        No, cancel
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>

  );
};
export default AnalyticsPage;
