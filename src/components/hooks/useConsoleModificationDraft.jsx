import { useEffect, useRef, useState } from 'react';

const useConsoleModificationDraft = () => {
    const [isReady, setIsReady] = useState(false);
    const [logs, setLogs] = useState([]);
    const logQueue = useRef([]);
    const observer = useRef(null);

    useEffect(() => {
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;
        const originalFetch = window.fetch;
        const originalXHROpen = XMLHttpRequest.prototype.open;
        const originalXHRSend = XMLHttpRequest.prototype.send;

        const addLog = (logData) => {
            setLogs((prevLogs) => [...prevLogs, logData]);
            sendLogToServer(logData);
        };

        const sendLogToServer = async (logData) => {
            if (!isReady) {
                return;
            }
            // if (['log', 'warn', 'info'].includes(logData.type)) {
            //     return;
            // }
            const clientAnalyticsSessionExist = sessionStorage.getItem('client-analytics-session-id');
            if (!clientAnalyticsSessionExist) {
                return;
            }

            const bodyData = { consoleIssue: JSON.stringify(logData) };
            let origin = location.origin;

            try {
                const response = await fetch(`${origin}/api/analytics/${clientAnalyticsSessionExist}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(bodyData),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                logQueue.current = logQueue.current.filter((log) => log !== logData);
            } catch (error) {
                originalError('Failed to send log to server:', error);
                if(error.status === 401) {

                }
                if (!logQueue.current.includes(logData)) {
                    logQueue.current.push(logData);
                }
            }
        };

        const retryLogs = () => {
            if (logQueue.current.length > 0) {
                logQueue.current.forEach((logData) => {
                    sendLogToServer(logData);
                });
            }
        };

        const overrideConsole = (type, originalMethod) => {
            console[type] = function (...args) {
                const logData = { type, message: args, timestamp: new Date().toISOString() };
                addLog(logData);
                originalMethod.apply(console, args);
            };
        };

        ['log', 'error', 'warn', 'info'].forEach((method) => {
            overrideConsole(method, console[method]);
        });

        window.onerror = (message, source, lineno, colno, error) => {
            const logData = { type: 'error', message: [message, source, lineno, colno, error], timestamp: new Date().toISOString() };
            addLog(logData);
            return false;
        };

        window.onunhandledrejection = (event) => {
            const logData = { type: 'error', message: ['Unhandled Promise Rejection:', event.reason], timestamp: new Date().toISOString() };
            addLog(logData);
        };

        const observerCallback = (mutationsList) => {
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE) {
                            const logData = { type: 'log', message: [node.textContent], timestamp: new Date().toISOString() };
                            addLog(logData);
                        }
                    });
                }
            }
        };

        observer.current = new MutationObserver(observerCallback);

        observer.current.observe(document.body, { childList: true, subtree: true });

        // const retryInterval = setInterval(retryLogs, 5000);

        window.fetch = async (...args) => {
            try {
                const response = await originalFetch(...args);
                if (!response.ok) {
                    const logData = { type: 'error', message: [`Fetch error: ${response.statusText}`, ...args], timestamp: new Date().toISOString() };
                    addLog(logData);
                }
                return response;
            } catch (error) {
                const logData = { type: 'error', message: ['Fetch error:', error, ...args], timestamp: new Date().toISOString() };
                addLog(logData);
                throw error;
            }
        };

        XMLHttpRequest.prototype.open = function (method, url, ...rest) {
            this._url = url;
            originalXHROpen.apply(this, [method, url, ...rest]);
        };

        XMLHttpRequest.prototype.send = function (...args) {
            this.addEventListener('load', function () {
                if (this.status >= 400) {
                    const logData = { type: 'error', message: [`XHR error: ${this.status}`, this._url, ...args], timestamp: new Date().toISOString() };
                    addLog(logData);
                }
            });

            this.addEventListener('error', function () {
                const logData = { type: 'error', message: ['XHR error:', this._url, ...args], timestamp: new Date().toISOString() };
                addLog(logData);
            });

            originalXHRSend.apply(this, args);
        };

        // Capture script execution errors in the console
        const scriptErrorHandler = (e) => {
            const logData = { type: 'error', message: [e.message, e.filename, e.lineno, e.colno, e.error], timestamp: new Date().toISOString() };
            addLog(logData);
        };

        window.addEventListener('error', scriptErrorHandler, true);

        return () => {
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
            console.info = originalInfo;
            window.onerror = null;
            window.onunhandledrejection = null;
            window.fetch = originalFetch;
            XMLHttpRequest.prototype.open = originalXHROpen;
            XMLHttpRequest.prototype.send = originalXHRSend;
            window.removeEventListener('error', scriptErrorHandler, true);
            if (observer.current) {
                observer.current.disconnect();
            }
            // clearInterval(retryInterval);
        };
    }, [isReady]);

    return { isReady, setIsReady, logs };
};

export default useConsoleModificationDraft;
