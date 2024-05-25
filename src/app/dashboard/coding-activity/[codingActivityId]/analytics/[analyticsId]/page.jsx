'use client';
import { api } from '@/utils/apibase';
import { getToken } from '@/utils/token';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';
import { UserContext } from '@/contextapi/UserProvider';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Sidebar from '@/components/Sidebar';
import { select } from 'd3';
const Page = ({ params }) => {
  const [analyticsList, setAnalyticsList] =
    useState(null);
  const [listLoading, setListLoading] = useState(null);
  const getAnalytics = async () => {
    const config = {
      method: 'GET',
      url: '/api/analytics/' + params.analyticsId,
      headers: {
        Authorization: `Bearer ${getToken('token')}`,
      },
      params: {
        select: '-time -screenWidth -screenHeight -updatedAt -__v',
      },
    };
    try {
      const response = await api.request(config);
      setAnalyticsList(response.data);
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + '. Login to try again.', {
          position: 'top-center',
        });
        return;
      } else {
        toast.error(error.message, {
          position: 'top-center',
        });
      }
      console.error(error);
    }
  };
  useEffect(() => {
    getAnalytics();
  }, [params.analyticsId]);
  // update user data
  // content type form data

  return (
    <>
      <Sidebar />
      <div className="p-4 sm:ml-64 bg-gray-700 min-h-screen">
        <div className="p-4 border-2 border-dashed rounded-lg border-gray-600">
          <div className="container mx-auto py-4 px-4 md:px-0">
            <div>
              <div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                  <table className="w-full text-sm text-left text-gray-400">
                    <thead className="text-xs uppercase bg-gray-900 text-gray-400">
                      <tr>
                        <th scope="col" className="px-6 py-3">
                          Key
                        </th>
                        <th scope="col" className="px-6 py-3">
                          Value
                        </th>
                      </tr>
                    </thead>
                    {!listLoading && (
                      <tbody>
                        {analyticsList?.results && Object.keys(analyticsList?.results).map(
                          (item, index) => (
                            <tr
                              className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600"
                              key={index}
                            >
                              <td className="px-6 py-4">
                                {item}
                              </td>
                              <td className="px-6 py-4">
                                {JSON.stringify(analyticsList?.results[item])}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default Page;
