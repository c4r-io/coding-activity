import { api } from '@/utils/apibase';
import { setToken } from '@/utils/token';
import React from 'react';
import { toast } from 'react-toastify';

const LoginPopup = () => {
    const [isLoginPopupOpen, setIsLoginPopupOpen] = React.useState(true);
    const usernameRef = React.useRef(null);
    const passwordRef = React.useRef(null);
    const registerUser = async () => {
        const password = passwordRef.current.value;
        const userName = usernameRef.current.value;
        const data = {};
        if (userName && password && userName !== null && password !== null) {
            data.userName = userName;
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
        const config = {
            method: 'post',
            url: 'api/student-authorization',
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
            setIsLoginPopupOpen(false);
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
    const handleSignin = () => {
        console.log('username', usernameRef.current.value)
        console.log('password', passwordRef.current.value)
        registerUser()
    }
    React.useEffect(() => {
        const authUserExist = localStorage.getItem('auth-user');
        if (authUserExist) {
            const authUser = JSON.parse(authUserExist);
            if (authUser && (authUser?.userName || authUser?.email) && authUser?.token) {
                setIsLoginPopupOpen(false);
            }
        }
    }, []);
    return (
        <div className={`${isLoginPopupOpen?"":"hidden"} absolute w-full h-full bg-slate-500/30 backdrop-blur-sm left-0 top-0 z-[100000]`}>
            <div className='flex justify-center items-center w-full h-full'>
                <div className='w-[250px]'>
                    <div className='bg-white border border-ui-violet rounded-lg p-3'>
                        <div className="flex flex-col space-y-3">
                            <input
                                ref={usernameRef}
                                type="text"
                                placeholder="Username"
                                className="border border-ui-violet rounded-md p-2 text-xs"
                            />
                            <input
                                ref={passwordRef}
                                type="password"
                                placeholder="Password"
                                className="border border-ui-violet rounded-md p-2 text-xs"
                            />
                            <button
                                onClick={handleSignin}
                                className="bg-ui-violet text-white rounded-md p-2 text-xs"
                            >
                                Sign In/Up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPopup;