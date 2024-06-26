
'use client';
import { UserContextProvider, UserContext } from '@/contextapi/UserProvider';
import { removeToken } from '@/utils/token';
import Link from 'next/link';
import { useContext, useEffect, useState, createContext } from 'react';
import { usePathname } from 'next/navigation';
import { path } from 'animejs';

const pathnameObjectListp = [
  { path: '/dashboard/user', name: 'User', children: [] },
  { path: '/dashboard/coding-activity', name: 'coding activity', children: [] },
];
export default function Sidebar({ data }) {
  if(data){
    pathnameObjectListp[1].children = data?.results?.map((item) => {
      return { path: `/dashboard/coding-activity/${item._id}`, name: item.activityTitle, children: [] }
    
    });
  }
  const [pathnameObjectList, setPathnameObjectList] = useState([
  ...pathnameObjectListp
  ])
  const [sidebarLeft, setSidebarLeft] = useState(true);
  const { userData, dispatchUserData } = useContext(UserContext);
  const pathname = usePathname();
  const sidebarLeftToggle = () => {
    setSidebarLeft(!sidebarLeft);
  };
  const signout = () => {
    removeToken('token');
    dispatchUserData({ type: 'logout' });
  };
  useEffect(() => {
    dispatchUserData({ type: 'checkLogin' });
  }, [sidebarLeft]);
  return (
    <>
      <aside
        id="default-sidebar"
        className={` absolute top-0 left-0 z-40 w-64 h-full transition-transform sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-800">
          <div
            className="absolute right-1 top-2 sm:hidden block"
            onClick={sidebarLeftToggle}
          >
            <svg
              className="w-4 h-4 text-white"
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
          </div>
          <ul className="space-y-2 font-medium mt-3 mb-10">
            <li>
              <div className="flex flex-col justify-center items-center p-2 rounded-lg text-white group bg-gray-900">
                {/* <div className="rounded-full bg-gray-600 p-4">
                  <svg
                    className="w-5 h-5text-white"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 14 18"
                  >
                    <path d="M7 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Zm2 1H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                  </svg>
                </div> */}
                <div className="mt-1 text-center">
                  <p>Signed as ({userData?.userInfo?.email})</p>
                </div>
              </div>
            </li>
            <li>
              <div className="space-y-2 font-medium mt-3 mb-10">
                <NestedList items={pathnameObjectList} />
              </div>
            </li>
          </ul>
          <button
            className="absolute bottom-0 left-0 w-full flex justify-between items-center p-2 ps-6 rounded-t-lg group text-white bg-red-900 hover:bg-red-700"
            onClick={signout}
          >
            <span>Log Out </span>
            <svg
              className="w-4 h-4 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 16 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 8h11m0 0-4-4m4 4-4 4m-5 3H3a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h3"
              />
            </svg>
          </button>
        </div>
      </aside>
    </>
  );
}
const PathnameColoseContext = createContext();
const NestedList = ({ items, prevPath = '/dashboard' }) => {
  const [currentPath, setCurrentPath] = useState(prevPath);
  return (
    <PathnameColoseContext.Provider value={{ currentPath, setCurrentPath }}>
      <ul>
        {items.map((item, index) => {
          const navigationPath = `${item.path}`;
          return (
            <LiList
              key={navigationPath + String(index)}
              item={item}
              index={index}
              navigationPath={navigationPath}
            />
          );
        })}
      </ul>
    </PathnameColoseContext.Provider>
  );
};
const LiList = ({ navigationPath, item, index }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { currentPath, setCurrentPath } = useContext(PathnameColoseContext);
  useEffect(() => {
    if (currentPath === navigationPath) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [currentPath]);
  useEffect(() => {
   setIsOpen(pathname.startsWith(navigationPath))
  }, [pathname]);
  
  const updatePathname = () => {
    setCurrentPath(navigationPath);
    setIsOpen(!isOpen);
  };
  return (
    <li
      key={navigationPath + String(index)}
      className="ml-1 border-l border-gray-500/50 relative overflow-hidden"
    >
      <Link
        href={navigationPath}
        onClick={() => updatePathname()}
        className={`relative z-50 flex items-center justify-between p-2 text-gray-900 rounded-tr-lg rounded-br-lg hover:bg-gray-700 ${
          pathname == navigationPath
            ? 'bg-blue-700'
            : 'text-white hover:bg-gray-100'
        } group `}
      >
        <span className="ml-3 capitalize">{item?.name}</span>
        {item?.children?.length > 0 ? (
          isOpen ? (
            <svg
              className="w-6 h-6 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m8 10 4 4 4-4"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-white"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m10 16 4-4-4-4"
              />
            </svg>
          )
        ) : (
          ''
        )}
      </Link>
      <div
        className={`${
          isOpen
            ? 'h-full opacity-100 translate-y-0'
            : 'h-0 opacity-0 -translate-y-full'
        } transition-all overflow-hidden duration-200`}
      >
        {item?.children && (
          <NestedList items={item.children} prevPath={navigationPath} />
        )}
      </div>
    </li>
  );
};
