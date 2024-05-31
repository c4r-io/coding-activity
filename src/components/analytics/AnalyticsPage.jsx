'use client';
import { api } from '@/utils/apibase';
import Pagination from '@/components/Pagination.jsx';
import { getToken } from '@/utils/token';
import { toast } from 'react-toastify';
import { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { UserContext } from '@/contextapi/UserProvider';
import { MdCheckBox, MdCheckBoxOutlineBlank } from 'react-icons/md';
import { useDeleteByIds } from '@/components/hooks/ApiHooks';
import Sidebar from '@/components/Sidebar';
import { PieChart } from '@/components/coding-activity/chart/PieChart';
import SortBtnComponent from '@/components/SortBtnComponent';
import BarChartApex from '../coding-activity/chart/BarChartApex';
import MonacoCodeEditor from '../coding-activity/MonacoCodeEditor';
import Script from 'next/script';
import SelectorObject from '../customElements/SelectorObject';
import { useFilterValues, useUpdateFeatureEngineeringCode } from './AnalyticsHooks';
import MultipleSelector from '../customElements/MultipleSelector';
import Link from 'next/link';
import { Checkbox } from '@headlessui/react';
import { filter } from 'lodash';
const AnalyticsPage = ({ analyticsListData, params, searchParams }) => {
  const filterHook = useFilterValues();
  const featureEngineeringCodeUpdater = useUpdateFeatureEngineeringCode();
  const sortOrder = searchParams.sortOrder || -1,
    sortKey = searchParams.sortKey || "permission";
  const { userData, dispatchUserData } = useContext(UserContext);
  const router = useRouter();
  const [analyticsList, setAnalyticsList] =
    useState(analyticsListData);
  useEffect(() => {
    setAnalyticsList(analyticsListData);
  }, [analyticsListData])
  const [page, setPage] = useState(searchParams.page || 1);
  const [deletePopup, setDeletePopup] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [analyticsKey, setAnalyticsKey] = useState("device");
  const [yAnalyticsKey, setYAnalyticsKey] = useState(null);
  const [reduction, setReduction] = useState(false);
  const [filterKey, setFilterKey] = useState("");
  const [filterValue1, setFilterValue1] = useState("");
  const [filterValue2, setFilterValue2] = useState("");
  const [bins, setBins] = useState(5);
  const [deleteList, setDeleteList] = useState([]);
  const [createLoading, setCreateLoading] = useState(false);
  const [featureEngineeringPopup, setFeatureEngineeringPopup] = useState(false);
  const [featureEngineeringCode, setFeatureEngineeringCode] = useState("");
  const [listLoading, setListLoading] = useState(false);
  const [errorPopup, setErrorPopup] = useState(null);
  const [issuePopup, setIssuePopup] = useState(null);
  const histogramValidKey = [
    "sessionDuration",
    "sessionTime.start",
    "sessionTime.end",
    "screenWidth",
    "screenHeight",
    "aspectRatio"
  ]
  const getAnalyticsDataList = async (page) => {
    dispatchUserData({ type: 'checkLogin' });
    const additionalParams = {}
    if (searchParams.sortKey) {
      additionalParams.sort = `${searchParams?.sortOrder == 1 ? "" : "-"}${searchParams.sortKey}`
    }
    console.log(yAnalyticsKey, filterKey, filterValue1)
    if (yAnalyticsKey) {
      additionalParams.yAnalyticsKey = yAnalyticsKey;
    }
    if (filterKey) {
      additionalParams.filterKey = filterKey
    }
    if (filterValue1) {
      additionalParams.filterValue1 = JSON.stringify(filterValue1)
    }
    if (bins) {
      additionalParams.bins = bins;
    }
    if (reduction) {
      additionalParams.reduction = reduction;
    }
    console.log("Sort Params", additionalParams)
    const config = {
      method: 'GET',
      url: '/api/analytics',
      headers: {
        Authorization: `Bearer ${getToken('token')}`,
      },
      params: {
        pageNumber: page,
        codingActivity: params.codingActivityId,
        select: '-sessionTime -ipinfo',
        analyticsKey: analyticsKey,
        histogramValidKey: JSON.stringify(histogramValidKey),
        ...additionalParams
      },
    };
    setListLoading(true);
    try {
      const response = await api.request(config);
      setAnalyticsList(response.data);
      // analyticsList = response.data;
      setFeatureEngineeringCode(response.data?.codingActivity?.featureEngineeringCode);
      console.log(response.data);
      setListLoading(false);
    } catch (error) {
      console.error(error);
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
  useEffect(() => {
    if (filterValue1) {
      getAnalyticsDataList(page);
    }
  }, [filterValue1])
  const applyFilter = async () => {
    getAnalyticsDataList(page);
  }
  const apiDeleteByIdHook = useDeleteByIds("/api/analytics");
  const handleDelete = async () => {
    apiDeleteByIdHook.deleteByIds(deleteList,
      () => {
        // success callback
        setDeletePopup(false);
        getAnalyticsDataList(page);
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
    getAnalyticsDataList(page);
  }, [page, analyticsKey, yAnalyticsKey, bins, reduction]);


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
  useEffect(() => {
    if (filterKey) {
      filterHook.get(filterKey);
      setFilterValue1("");
      setFilterValue2("");
    }
  }, [filterKey])
  const filterOptionsArray = [
    { key: null, value: "None" },
    { key: "sessionDuration", value: "Total Duration" },
    { key: "ip", value: "IP" },
    { key: "country", value: "Country" },
    { key: "device", value: "OS" },
    { key: "deviceVersion", value: "OS Version" },
    { key: "screenWidth", value: "Width" },
    { key: "screenHeight", value: "Height" },
    { key: "aspectRatio", value: "Aspect Ratio" },
    { key: "uid", value: "Device" },
    { key: "_id", value: "Session" },
  ];
  const optionsArray = [
    { key: "sessionDuration", value: "Total Duration" },
    { key: "ip", value: "IP" },
    { key: "country", value: "Country" },
    { key: "device", value: "OS" },
    { key: "deviceVersion", value: "OS Version" },
    { key: "screenWidth", value: "Width" },
    { key: "screenHeight", value: "Height" },
    { key: "aspectRatio", value: "Aspect Ratio" },
    { key: "uid", value: "Device" },
    { key: "_id", value: "Session" },
  ];
  const yOptionArray = [
    { key: null, value: "None" },
    { key: "ip", value: "IP" },
    { key: "country", value: "Country" },
    { key: "device", value: "OS" },
    { key: "deviceVersion", value: "OS Version" },
    { key: "uid", value: "Device" },
    { key: "_id", value: "Session" },
  ];
  const BAR_CHART_DATA = [
    { label: "Apples", value: 100 },
    { label: "Bananas", value: 200 },
    { label: "Oranges", value: 50 },
    { label: "Kiwis", value: 150 }
  ];
  const fix = async (callbackSuccess, callbackError) => {
    const config = {
      method: "put",
      url: "/api/analytics/fix",
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    try {
      const response = await api.request(config);
      if (callbackSuccess) {
        callbackSuccess(response.data)
      }
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + ". Login to try again.", {
          position: "top-center",
        });
      } else {
        toast.error(error.message, {
          position: "top-center",
        });
      }
      if (callbackError) {
        callbackError(error)
      }
      console.error(error);
    }
  };
  const pyodideStatusRef = useRef(false);
  const [pyodideStatus, setPyodideStatus] = useState(pyodideStatusRef.current);
  const pyodide = useRef(null);
  async function getReadyPyodide() {
    pyodide.current = await window.loadPyodide();
    await pyodide.current.loadPackage("micropip");
    await pyodide.current.loadPackage("sympy");
    const micropip = pyodide.current.pyimport("micropip");
    await micropip.install("matplotlib");
    await micropip.install("numpy");
    await micropip.install("autopep8");
    await micropip.install("seaborn"); // dynamic loads not working in pyodide
    await micropip.install("pandas");
    await micropip.install("sympy");
    setPyodideStatus(true);
    pyodideStatusRef.current = true;
  }
  const [featureEngList, setFeatureEngList] = useState([]);
  const runFeatureEngineering = async (apiCallCount = 0) => {
    const code = analyticsList?.codingActivity?.featureEngineeringCode;
    const list = analyticsList?.results;
    console.log("code: ", code);
    if (code == "") {
      alert("Please enter code to execute");
      return;
    }
    const nc = code.split("listOfDataFromAPI");
    const nc2 = nc[0] + `
r"""${JSON.stringify(list)}"""
`+ nc[1];

    try {
      // console.log("executable code: ", nc2);
      const op = pyodide.current.runPython(`
${nc2}`)
        ;
      console.log("python op: ", op);
      const jsonop = JSON.parse(op);
      setFeatureEngList(jsonop);
    } catch (error) {
      if (apiCallCount < 3) {
        console.log("retrying in 3 seconds");
        getReadyPyodide();
        setTimeout(() => {
          runFeatureEngineering(apiCallCount + 1);
        }, 1000)
      } else {
        console.error(error);
      }
    }
  }
  const runFEPyodide = async ({ apiCallCount, currentPage, pages, results }) => {
    const code = featureEngineeringCode;
    const list = results;
    console.log("code: ", code);
    if (code == "") {
      alert("Please enter code to execute");
      return;
    }
    const nc = code.split("listOfDataFromAPI");
    const nc2 = nc[0] + `
r"""${JSON.stringify(list)}"""
`+ nc[1];

    try {
      // console.log("executable code: ", nc2);
      const op = pyodide.current.runPython(`
${nc2}`)
        ;
      console.log("python op: ", op);
      const jsonop = JSON.parse(op);
      await updateFeatureEngineering({ currentPage, pages, results: jsonop })
    } catch (error) {
      if (apiCallCount < 3) {
        getReadyPyodide();
        setTimeout(() => {
          runFEPyodide({ apiCallCount: apiCallCount + 1, currentPage, pages, results });
        }, 1000)
      } else {
        console.error(error);
      }
    }
  }
  const [isApplyingfeatureEngineering, setIsApplyingfeatureEngineering] = useState(false);
  const applyFeatureEngineering = async ({ currentPage }) => {
    const config = {
      method: 'GET',
      url: '/api/analytics/feature-engineering',
      headers: {
        Authorization: `Bearer ${getToken('token')}`,
      },
      params: {
        pageNumber: currentPage
      },
    };
    setIsApplyingfeatureEngineering(true);
    try {
      const response = await api.request(config);
      const data = response.data;
      console.log("FE get data: ", data)
      await runFEPyodide({ apiCallCount: 0, currentPage: data.page, pages: data.pages, results: data.results })
      // setIsApplyingfeatureEngineering(false);
    } catch (error) {
      console.error(error);
      setIsApplyingfeatureEngineering(false);
      toast.error(error.message, {
        position: 'top-center',
      });
    }
  }
  const updateFeatureEngineering = async ({ currentPage, pages, results }) => {
    const config = {
      method: 'POST',
      url: '/api/analytics/feature-engineering',
      data: {
        featureEngineeredDatas: results
      },
    };
    setIsApplyingfeatureEngineering(true);
    try {
      const response = await api.request(config);
      const results = response.data.results;
      console.log("results: ", results);
      if (currentPage < pages) {
        applyFeatureEngineering({ currentPage: currentPage + 1 })
      } else {
        location.reload();
        setIsApplyingfeatureEngineering(false);
      }
    } catch (error) {
      console.error(error);
      setIsApplyingfeatureEngineering(false);
      toast.error(error.message, {
        position: 'top-center',
      });
    }
  }
  // useEffect(() => {
  //   if (pyodideStatus) {
  //     runFeatureEngineering()
  //   }
  // }, [pyodideStatus])
  useEffect(() => {
    const checkVisivility = () => {
      if (document.hidden) {
        console.log('Tab is inactive');
      } else {
        console.log('Tab is active');
        if (featureEngList && featureEngList.length == 0 && pyodideStatus) {
          runFeatureEngineering()
        }
        if (pyodide.current == null) {
          getReadyPyodide();
          console.log("get pyodide ready")
        } else if (pyodideStatus == false) {
          setPyodideStatus(true);
          console.log("set pyodide status ready")
        }
      }
    }
    document.addEventListener('visibilitychange', checkVisivility);
    return () => {
      document.removeEventListener('visibilitychange', checkVisivility)
    }
  }, [])
  const getFeatureEngineeringFilterKeys = () => {
    const fe = analyticsList?.results[0]?.featureEngineeredData
    if (fe) {
      return Object.keys(fe).map((item) => ({ key: `featureEngineeredData.${item}`, value: item }))
    }
    return []
  }
  return (
    <>
      <Script
        id=""
        src="https://cdn.jsdelivr.net/pyodide/v0.25.0/full/pyodide.js"
        onLoad={() => {
          getReadyPyodide();
        }}
      />
      <Sidebar />
      <div className="p-4 sm:ml-64 bg-gray-700 min-h-screen">
        <div className="p-4 border-2 border-dashed rounded-lg border-gray-600">

          <div className="container mx-auto py-4 px-4 md:px-0">
            <div>
              {/* <button
                onClick={() => fix()}
              >FIx data</button> */}
              <div className="w-full flex-colflex justify-center items-center text-white pb-3">
                <div className='py-2'>
                  <div className='flex flex-wrap -m-1'>
                    <div className="p-1 w-56">
                      <label
                        htmlFor="analyticsKey"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Plot ({optionsArray.find(e => e.key === analyticsKey)?.value})
                      </label>
                      {/* <select
                      value={analyticsKey}
                      onChange={(e) => setAnalyticsKey(e.target.value)}
                      id="analyticsKey"
                      className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Choose a analytics key</option>
                      {optionsArray.map((item, index) =>
                        <option key={index} value={item.key}>{item.value}</option>
                      )}
                    </select> */}
                      <SelectorObject
                        fields={optionsArray}
                        labelKey="value"
                        handleSelected={(e) => setAnalyticsKey(e.key)}

                      >
                        {optionsArray.find(e => e.key === analyticsKey)?.value}
                      </SelectorObject>
                    </div>
                    <div className="p-1 w-56">
                      <label
                        htmlFor="analyticsKey"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Group by ({yOptionArray.find(e => e.key === yAnalyticsKey)?.value})
                      </label>
                      {/* <select
                      value={yAnalyticsKey}
                      onChange={(e) => setYAnalyticsKey(e.target.value)}
                      id="analyticsKey"
                      className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Choose a analytics key</option>
                      {yOptionArray.map((item, index) =>
                        <option key={index} value={item.key}>{item.value}</option>
                      )}
                    </select> */}

                      <SelectorObject
                        fields={yOptionArray}
                        labelKey="value"
                        handleSelected={(e) => setYAnalyticsKey(e.key)}

                      >
                        {yOptionArray.find(e => e.key === yAnalyticsKey)?.value}
                      </SelectorObject>
                    </div>

                    <div className={`p-1 ${histogramValidKey.includes(analyticsKey) ? "" : "hidden"}`}>
                      <label
                        htmlFor="binsize"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Number of bins ({bins})
                      </label>
                      <input
                        value={bins}
                        onChange={(e) => setBins(e.target.value)}
                        type='number'
                        id="binsize"
                        className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                      >
                      </input>
                    </div>
                    <div className={`p-1`}>
                      <label
                        htmlFor="reduction"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Reduction ({reduction ? "true" : "false"})
                      </label>
                      <Checkbox
                        checked={reduction}
                        onChange={setReduction}
                        className="group block size-10 rounded border border-gray-600 bg-transparent data-[checked]:bg-transparent"
                      >
                        {/* Checkmark icon */}
                        <svg className="stroke-white opacity-0 group-data-[checked]:opacity-100" viewBox="0 0 14 14" fill="none">
                          <path d="M3 8L6 11L11 3.5" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </Checkbox>
                    </div>
                    <div className="p-1 w-56">
                      <label
                        htmlFor="filterKey"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Filter by ({filterOptionsArray.find(e => e.key === filterKey)?.value})
                      </label>
                      {/* <select
                      value={filterKey}
                      onChange={(e) => setFilterKey(e.target.value)}
                      id="filterKey"
                      className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option>Choose a filter key</option>
                      {filterOptionsArray.map((item, index) =>
                        <option key={index} value={item.key}>{item.value}</option>
                      )}
                    </select> */}
                      <SelectorObject
                        fields={[...filterOptionsArray, ...getFeatureEngineeringFilterKeys()]}
                        labelKey="value"
                        handleSelected={(e) => setFilterKey(e.key)}
                      >
                        {filterOptionsArray.find(e => e.key === filterKey)?.value}
                      </SelectorObject>
                    </div>
                    <div className={`p-1 w-56 ${filterKey && filterHook.filterValues ? "" : "hidden"}`}>
                      <label
                        htmlFor="filterKey"
                        className="block mb-2 text-sm font-medium text-white"
                      >
                        Filter Value
                      </label>
                      <MultipleSelector
                        fields={filterHook.filterValues}
                        handleSelected={(e) => setFilterValue1(e)}
                      >
                        {filterValue1 ? filterValue1.join(", ") : "None"}
                      </MultipleSelector>
                    </div>
                    {/* <div className={`p-1 w-56 ${filterKey && filterHook.filterValues ? "" : "hidden"}`}>
                      <button className='edit_button bg-ui-violet hover:bg-ui-violet'
                        onClick={applyFilter}
                      >Apply FIlter</button>
                    </div> */}
                  </div>
                </div>
                {analyticsList?.barAnalytics ? (
                  <BarChartApex data={analyticsList?.barAnalytics || []} />
                ) : (
                  <PieChart data={analyticsList?.analytics || []} />
                )}
                {/* <BarChart data={analyticsList?.barAnalytics || []} /> */}
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
                <div className={`p-1`}>
                  {pyodideStatus ?
                    <button
                      type="button"
                      className="edit_button"
                      onClick={() => setFeatureEngineeringPopup(true)}
                    >
                      Feature Engineering Ready
                    </button>
                    :
                    <button
                      type="button"
                      className="edit_button"
                      onClick={() => getReadyPyodide()}
                    >
                      Feature Engineering Loading {pyodideStatus}
                    </button>
                  }
                </div>
              </div>
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                {/* <div>{JSON.stringify(analyticsList?.results)}</div> */}
                <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs bg-gray-900 text-gray-400">
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
                        submissions
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <div>
                          error1
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        error2
                      </th>
                      <th scope="col" className="px-6 py-3">
                        error3
                      </th>
                      <th scope="col" className="px-6 py-3">
                        errorList
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"uid"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* UID */}
                          uid
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"createdAt"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Date */}
                          createdAt
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"sessionStartTime"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Start Time */}
                          sessionStartTime
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"sessionEndTime"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* End Time */}
                          sessionEndTime
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"sessionDuration"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Total Duration */}
                          sessionDuration
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"ip"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* IP */}
                          ip
                        </SortBtnComponent>

                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"city"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* City */}
                          city
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"region"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Region */}
                          region
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"country"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Country */}
                          country
                        </SortBtnComponent>

                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"latitude"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Latitude */}
                          latitude
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"longitude"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Longitude */}
                          longitude
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"asn"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* ASN */}
                          asn
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"asnName"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Org Name */}
                          asnName
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"postal"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Postal */}
                          postal
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"continental"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Timezone Continent */}
                          continent
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"browser"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Browser */}
                          browser
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"browserVersion"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Browser Version */}
                          browserVersion
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"device"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Device */}
                          device
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"deviceVersion"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* Device Version */}
                          deviceVersion
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"screenWidth"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* AspectRatio */}
                          screenWidth
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"screenHeight"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* AspectRatio */}
                          screenHeight
                        </SortBtnComponent>
                      </th>
                      <th scope="col" className="px-6 py-3">
                        <SortBtnComponent
                          feildKey={"aspectRatio"}
                          sortOrder={sortOrder}
                          sortKey={sortKey}
                        >
                          {/* AspectRatio */}
                          aspectRatio
                        </SortBtnComponent>
                      </th>
                      {analyticsList?.results[0]?.featureEngineeredData && Object.keys(analyticsList?.results[0]?.featureEngineeredData).length > 0 && Object.keys(analyticsList?.results[0]?.featureEngineeredData).map((item2, index) => (
                        <th scope="col" className="px-6 py-3" key={index}>
                          <SortBtnComponent
                            feildKey={`featureEngineeredData.${item2}`}
                            sortOrder={sortOrder}
                            sortKey={sortKey}
                          >
                            {item2}
                          </SortBtnComponent>
                        </th>
                      ))}
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
                              {item?.submissions ?
                                <Fragment>
                                  <button className={`${item?.submissions ? "text-ui-violet" : "pointer-events-none"}`}
                                    onClick={() => setIssuePopup(item?.submissions)}
                                  >
                                    Show
                                  </button>
                                </Fragment>
                                : "No Submissions"}
                            </td>
                            <td className="px-6 py-4">
                              {item?.error1?.errorCode ?
                                <Fragment>
                                  <button className={`${item?.error1?.errorCode ? "text-ui-violet" : "pointer-events-none"}`}
                                    onClick={() => setIssuePopup([item?.error1])}
                                  >
                                    {item?.error1?.errorCode}
                                  </button>
                                </Fragment>
                                : "No Issue"}
                            </td>
                            <td className="px-6 py-4">
                              {item?.error2?.errorCode ?
                                <Fragment>
                                  <button className={`${item?.error2?.errorCode ? "text-ui-violet" : "pointer-events-none"}`}
                                    onClick={() => setErrorPopup([item?.error2])}
                                  >
                                    {item?.error2?.errorCode}
                                  </button>
                                </Fragment>
                                : "No Issue"}
                            </td>
                            <td className="px-6 py-4">
                              {item?.error3?.errorCode ?
                                <Fragment>
                                  <button className={`${item?.error3?.errorCode ? "text-ui-violet" : "pointer-events-none"}`}
                                    onClick={() => setErrorPopup([item?.error3])}
                                  >
                                    {item?.error3?.errorCode}
                                  </button>
                                </Fragment>
                                : "No Issue"}
                            </td>
                            <td className="px-6 py-4">
                              <button className={`${item?.errorList?.length > 0 ? "text-ui-violet" : "pointer-events-none"}`}
                                onClick={() => setErrorPopup(item?.errorList)}
                              >
                                {item?.errorList?.length > 0 ? "Click To See" : "No Additional Issue"}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              {item?.uid}
                            </td>
                            <td className="px-6 py-4">
                              {(new Date(item?.createdAt)).toISOString().slice(0, 10)}
                            </td>
                            <td className="px-6 py-4">
                              {item?.sessionStartTime}
                            </td>
                            <td className="px-6 py-4">
                              {item?.sessionEndTime}
                            </td>
                            <td className="px-6 py-4">
                              {item?.sessionDuration}
                            </td>
                            <td className="px-6 py-4">
                              {item?.ip}
                            </td>
                            <td className="px-6 py-4">
                              {item?.city}
                            </td>
                            <td className="px-6 py-4">
                              {item?.region}
                            </td>
                            <td className="px-6 py-4">
                              {item?.country}
                            </td>
                            <td className="px-6 py-4">
                              {item?.latitude}
                            </td>
                            <td className="px-6 py-4">
                              {item?.longitude}
                            </td>
                            <td className="px-6 py-4">
                              {item?.asn}
                            </td>
                            <td className="px-6 py-4">
                              {item?.asnName}
                            </td>
                            <td className="px-6 py-4">
                              {item?.postal}
                            </td>
                            <td className="px-6 py-4">
                              {item?.continent}
                            </td>
                            <td className="px-6 py-4">
                              {item?.browser}
                            </td>
                            <td className="px-6 py-4">
                              {item?.browserVersion}
                            </td>
                            <td className="px-6 py-4">
                              {item?.device}
                            </td>
                            <td className="px-6 py-4">
                              {item?.deviceVersion}
                            </td>
                            <td className="px-6 py-4">
                              {item?.screenWidth}
                            </td>
                            <td className="px-6 py-4">
                              {item?.screenHeight}
                            </td>
                            <td className="px-6 py-4">
                              {item?.aspectRatio}
                            </td>
                            {analyticsList?.results[0]?.featureEngineeredData && Object.keys(analyticsList?.results[0]?.featureEngineeredData).length > 0 && Object.keys(analyticsList?.results[0]?.featureEngineeredData).map((item2, item2Index) => (
                              <td scope="col" className="px-6 py-3" key={item2Index}>
                                {analyticsList?.results[index]?.featureEngineeredData[item2]}
                              </td>
                            ))}
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
            {deletePopup ? (
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
            ) : ""}
            {featureEngineeringPopup ? (
              <div className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-50/50">
                <div className="relative w-full max-w-md max-h-full">
                  <div className="relative rounded-lg shadow bg-gray-700">
                    <button
                      type="button"
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                      data-modal-hide="popup-modal"
                      onClick={() => setFeatureEngineeringPopup(false)}
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

                      <div className="my-5 text-lg font-normal text-gray-400">
                        {analyticsList?.codingActivity?.featureEngineeringCode
                          &&
                          <MonacoCodeEditor
                            value={analyticsList?.codingActivity?.featureEngineeringCode || ""}
                            onChange={(e) => setFeatureEngineeringCode(e)}
                            height={"50vh"}
                            width={"100%"}
                            language="python"
                          />
                        }
                      </div>
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                        onClick={() => featureEngineeringCodeUpdater.update(params.codingActivityId, featureEngineeringCode)}
                      >
                        {featureEngineeringCodeUpdater.loading ? "Saving..." : "Save Code"}
                      </button>
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        className="text-white bg-green-600 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-800 font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center mr-2"
                        onClick={() => applyFeatureEngineering({ currentPage: 1 })}
                      >
                        {isApplyingfeatureEngineering ? "Applying..." : "Apply"}
                      </button>
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600"
                        onClick={() => {
                          setFeatureEngineeringPopup(false);
                        }}
                      >
                        Discard Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : ""}
            {errorPopup ? (
              <div className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-50/50"
                onClick={() => setErrorPopup(null)}
              >
                <div className="relative w-full max-w-md max-h-full">
                  <div className="relative rounded-lg shadow bg-gray-700"

                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                      data-modal-hide="popup-modal"
                      onClick={() => setErrorPopup(null)}
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
                      <div className='p-2 rounded-md overflow-auto'>
                        {errorPopup.map((item, index) => (
                          <div key={index}>
                            <div>{item.errorCode}</div>
                            <div>{item.description}</div>
                          </div>
                        ))}
                      </div>
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600"
                        onClick={() => {
                          setErrorPopup(null);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : ""}
            {issuePopup ? (
              <div className="fixed top-0 left-0 right-0 z-50 p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] max-h-full flex justify-center items-center bg-gray-50/50"
                onClick={() => setIssuePopup(null)}
              >
                <div className="relative w-full max-w-md max-h-full">
                  <div className="relative rounded-lg shadow bg-black"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="absolute top-3 right-2.5 text-gray-400 bg-transparent rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center hover:bg-gray-600 hover:text-white"
                      data-modal-hide="popup-modal"
                      onClick={() => setIssuePopup(null)}
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
                      <div className='p-2 rounded-md overflow-auto text-white'>
                        {issuePopup.map((item, index) => {
                          return (
                            <div key={index} className={`pb-2 text-left text-xs border-b border-gray-500`}>
                              <div>issue : {item?.issue}</div>
                              <div>feedback : {item?.feedback}</div>
                              <div className='text-xs whitespace-pre-wrap'>report : {item?.report ? JSON.stringify(item?.report, null, 2) : ""}</div>
                              <div>attachment :
                              </div>
                              <div className='ml-2'>data :
                                {item?.attachment ?
                                  <img className='py-2 rounded-sm' src={item?.attachment?.data} />
                                  : ""}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                      <button
                        data-modal-hide="popup-modal"
                        type="button"
                        className="focus:ring-4 focus:outline-none rounded-lg border text-sm font-medium px-5 py-2.5 focus:z-10 bg-gray-700 text-gray-300 border-gray-500 hover:text-white hover:bg-gray-600 focus:ring-gray-600"
                        onClick={() => {
                          setIssuePopup(null);
                        }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : ""}
          </div>
        </div>
      </div>
    </>

  );
};
export default AnalyticsPage;
