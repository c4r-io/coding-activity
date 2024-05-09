'use client';
import { api } from '@/utils/apibase';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useContext } from 'react';
import { setToken } from '@/utils/token';
import { UserContext } from '@/contextapi/UserProvider';
import isValidEmail from '@/utils/isValidEmail.js';
const Page = ({ params }) => {
  const router = useRouter();
  const [login, setLogin] = useState(true);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const { userData, dispatchUserData } = useContext(UserContext);
  // update user data
  // content type form data
  const loginUser = async (e) => {
    e.preventDefault();
    const data = {};
    if (email && password && email !== null && password !== null) {
      data.email = email;
      data.password = password.trim();
    }
    if (Object.keys(data).length <= 0) {
      toast.error(
        'Empty Form Submission Not Allowed, Try after changing data.',
        {
          position: 'top-center',
        },
      );
      return;
    }
    const config = {
      method: 'post',
      url: 'api/login',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // bodyObject
      data,
    };
    try {
      const response = await api.request(config);
      localStorage.setItem('auth-user', JSON.stringify(response.data));
      setToken('token', response.data.token);
      dispatchUserData({
        type: 'login',
        userInfo: JSON.stringify(response.data),
      });
      router.push('/dashboard');
    } catch (error) {
      if (error?.response?.status == 401) {
        toast.error(error.response.data.message + '. Try again.', {
          position: 'top-center',
        });
        // router.push('/');
      } else {
        toast.error(error.message, {
          position: 'top-center',
        });
      }
      console.error(error);
    }
  };
  const registerUser = async (e) => {
    e.preventDefault();
    const data = {};
    if (!isValidEmail(email)) {
      toast.error('Invalid email format.', {
        position: 'top-center',
      });
      return;
    }
    if (email && password && email !== null && password !== null) {
      data.email = email;
      data.password = password;
    }
    if (Object.keys(data).length <= 0) {
      toast.error(
        'Empty Form Submission Not Allowed, Try after changing data.',
        {
          position: 'top-center',
        },
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Password and Confirm password not matched', {
        position: 'top-center',
      });
      return;
    }
    const config = {
      method: 'post',
      url: 'api/register',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // bodyObject
      data,
    };
    try {
      const response = await api.request(config);
      localStorage.setItem('auth-user', JSON.stringify(response.data));
      setToken('token', response.data.token);
      dispatchUserData({
        type: 'login',
        userInfo: JSON.stringify(response.data),
      });
      router.push('/dashboard');
    } catch (error) {
      if (error?.response?.status == 403) {
        toast.error(error.response.data.message + '. Try again.', {
          position: 'top-center',
        });
        // router.push('/');
      } else {
        toast.error(error.message, {
          position: 'top-center',
        });
      }
      console.error(error);
    }
  };
  return (
    <div className="">
      <div className="mb-4 border-b border-gray-200 dark:border-gray-700">
        <ul
          className="flex flex-wrap -mb-px text-sm font-medium text-center"
          id="myTab"
          data-tabs-toggle="#myTabContent"
          role="tablist"
        >
          <li className="mr-2" role="presentation">
            <button
              className={`${
                login ? 'bg-gray-400 dark:bg-grey-800 ' : ''
              } inline-block p-4 rounded-t-lg text-black dark:text-white`}
              id="profile-tab"
              data-tabs-target="#profile"
              type="button"
              role="tab"
              aria-controls="profile"
              aria-selected="false"
              onClick={() => setLogin(true)}
            >
              {' '}
              Login{' '}
            </button>
          </li>
          <li className="mr-2" role="presentation">
            <button
              className={`${
                !login ? 'bg-gray-400 dark:bg-grey-800 ' : ''
              } inline-block p-4 rounded-t-lg text-black dark:text-white`}
              id="profile-tab"
              onClick={() => setLogin(false)}
            >
              {' '}
              Register{' '}
            </button>
          </li>
        </ul>
      </div>
      <div>
        <div
          className={`${
            login ? '' : 'hidden'
          } p-4 rounded-lg bg-gray-50 dark:bg-gray-800`}
        >
          <form onSubmit={loginUser} className="w-72">
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {' '}
                Email address
              </label>
              <input
                type="text"
                id="email"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="john.doe@company.com"
                defaultValue={''}
                onInput={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {' '}
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="•••••••••"
                defaultValue={''}
                onInput={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Log In
              </button>
            </div>
          </form>
        </div>
        <div
          className={`${
            !login ? '' : 'hidden'
          } p-4 rounded-lg bg-gray-50 dark:bg-gray-800`}
        >
          <form onSubmit={registerUser} className="w-72">
            <div className="mb-6">
              <label
                htmlFor="userName"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {' '}
                Email address
              </label>
              <input
                type="text"
                id="userName"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="john.doe@company.com"
                defaultValue={''}
                onInput={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {' '}
                Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="•••••••••"
                defaultValue={''}
                onInput={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                {' '}
                Confirm Password
              </label>
              <input
                type="password"
                id="password"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"
                placeholder="•••••••••"
                defaultValue={''}
                onInput={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="w-full flex justify-center">
              <button
                type="submit"
                className="text-white bg-gradient-to-r from-cyan-500 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-cyan-300 dark:focus:ring-cyan-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2"
              >
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default Page;
