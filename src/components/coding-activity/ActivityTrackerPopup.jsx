import { api } from '@/utils/apibase';
import { setToken } from '@/utils/token';
import React from 'react';
import { toast } from 'react-toastify';
import { useAnalytics } from '../hooks/ApiHooks';

// Login popup had beed created to get student login details
const ActivityTrackerPopup = () => {
    const resetInMax = 10;
    const activitySessionCheckInMax = 30;
    const [isActivityTrackerPopupOpen, setIsActivityTrackerPopupOpen] = React.useState(true);
    const [isActivityStarted, setIsActivityStarted] = React.useState(false)
    const analytics = useAnalytics();
    const timeCount = React.useRef(0)
    const sessionResterTimeCount = React.useRef(resetInMax)
    const [sessionResterTime, setSessionResterTime] = React.useState(resetInMax)
    const startTimerFunction = React.useRef(null)
    const sessionReseterTimerFunction = React.useRef(null)

    const startSessionRestTimer = () => {
        analytics.send()
        sessionReseterTimerFunction.current = setInterval(() => {
            if (sessionResterTimeCount.current > 0) {
                sessionResterTimeCount.current--
                setSessionResterTime(sessionResterTimeCount.current)
            }
            if (sessionResterTimeCount.current <= 0) {
                clearInterval(sessionReseterTimerFunction.current)
                sessionReseterTimerFunction.current = null
                console.log('Session Time is up')
                endSession()
            }
        }, 1000)
    }
    const endSession = () => {
        setIsActivityStarted(false)
        sessionStorage.removeItem('client-analytics-session-id')
        setIsActivityTrackerPopupOpen(true);
        timeCount.current = 0
        sessionResterTimeCount.current = resetInMax
        setSessionResterTime(sessionResterTimeCount.current)
        if(sessionReseterTimerFunction.current){
            clearInterval(sessionReseterTimerFunction.current)
            sessionReseterTimerFunction.current = null
        }
        if(startTimerFunction.current){
            clearInterval(startTimerFunction.current)
            startTimerFunction.current = null
        }
    }
    function startSessionTimer() {
        analytics.send()
        if(sessionReseterTimerFunction.current){
            clearInterval(sessionReseterTimerFunction.current)
            sessionReseterTimerFunction.current = null
        }
        if(startTimerFunction.current){
            clearInterval(startTimerFunction.current)
            startTimerFunction.current = null
        }
        timeCount.current = 0
        setIsActivityTrackerPopupOpen(false);
        setIsActivityStarted(true);
        sessionResterTimeCount.current = resetInMax
        setSessionResterTime(sessionResterTimeCount.current)
        function resetTimerOnEvent() {
            function resetTimerToZero() {
                timeCount.current = 0
            }
            window.addEventListener('mousemove', () => {
                resetTimerToZero()
            })
            window.addEventListener('keydown', () => {
                resetTimerToZero()
            })
            window.addEventListener('click', () => {
                resetTimerToZero()
            })
        }
        startTimerFunction.current = setInterval(() => {
            if (timeCount.current < activitySessionCheckInMax) {
                timeCount.current++
                resetTimerOnEvent()
                console.log('Time:', timeCount.current)
            }
            if (timeCount.current >= activitySessionCheckInMax) {
                clearInterval(startTimerFunction.current)
                startTimerFunction.current = null
                console.log('Time is up')
                setIsActivityTrackerPopupOpen(true);
                startSessionRestTimer()
                setIsActivityStarted(true)
                // sessionStorage.removeItem('client-analytics-session-id')
            }
        }, 1000)
    }
    React.useEffect(() => {
        const authUserExist = localStorage.getItem('client-analytics-session-id');
        if (authUserExist) {
            const authUser = JSON.parse(authUserExist);
            if (authUser && (authUser?.userName || authUser?.email) && authUser?.token) {
                setIsActivityTrackerPopupOpen(false);
            }
        }
    }, []);
    return (
        <div className={`${isActivityTrackerPopupOpen ? "" : "hidden"} absolute w-full h-full bg-slate-500/30 backdrop-blur-sm left-0 top-0 z-[100000]`}>
            <div className='flex justify-center items-center w-full h-full'>
                <div className='w-[250px]'>
                    {!isActivityStarted ?
                        <div className='bg-white border border-ui-violet rounded-lg p-3'>
                            <div className="flex -m-1">
                                <div className='p-1 flex-1'>
                                    <button
                                        className="bg-ui-violet text-white rounded-md p-2 text-xs w-full"
                                        onClick={() => {
                                            startSessionTimer()
                                        }}
                                    >
                                        Start
                                    </button>
                                </div>
                            </div>
                        </div> :
                        <div className='bg-white border border-ui-violet rounded-lg p-3'>
                            <div className='text-center pb-3'>Ending in {sessionResterTime} seconds</div>
                            <div className="flex -m-1">
                                <div className='p-1 flex-1'>
                                    <button
                                        className="bg-ui-violet text-white rounded-md p-2 text-xs w-full"
                                        onClick={() => {
                                            startSessionTimer()
                                        }}
                                    >
                                        Resume
                                    </button>
                                </div>
                                <div className='p-1 flex-1'>
                                    <button
                                        className="bg-ui-orange text-white rounded-md p-2 text-xs w-full"
                                        onClick={() => { endSession() }}
                                    >
                                        End
                                    </button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
};

export default ActivityTrackerPopup;