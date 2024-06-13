import { useEffect, useRef, useState } from 'react';

const useConsoleModification = () => {
    const [isReady, setIsReady] = useState(false);
    // Create a queue for log messages
    const logQueue = useRef([]);
    useEffect(() => {
        // Store original console methods
        const originalLog = console.log;
        const originalError = console.error;
        const originalWarn = console.warn;
        const originalInfo = console.info;

        // Function to send log data to the backend
        const sendLogToServer = async (logData) => {
            if (!isReady) {
                return;
            }
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

                // Remove the log from the queue if successfully sent
                logQueue.current = logQueue.current.filter((log) => log !== logData);
            } catch (error) {
                originalError('Failed to send log to server:', error);
                // Retry logic: add log data to the queue
                if (!logQueue.current.includes(logData)) {
                    logQueue.current.push(logData);
                }
            }
        };

        // Retry sending logs in the queue
        const retryLogs = () => {
            if (logQueue.current.length > 0) {
                logQueue.current.forEach((logData) => {
                    sendLogToServer(logData);
                });
            }
        };

        // Override console.log
        console.log = function (...args) {
            const logData = { type: 'log', message: args, timestamp: new Date().toISOString() };
            //   sendLogToServer(logData);
            originalLog.apply(console, args);
        };

        // Override console.error
        console.error = function (...args) {
            const logData = { type: 'error', message: args, timestamp: new Date().toISOString() };
            sendLogToServer(logData);
            originalError.apply(console, args);
        };

        // Override console.warn
        console.warn = function (...args) {
            const logData = { type: 'warn', message: args, timestamp: new Date().toISOString() };
            // sendLogToServer(logData);
            originalWarn.apply(console, args);
        };

        // Override console.info
        console.info = function (...args) {
            const logData = { type: 'info', message: args, timestamp: new Date().toISOString() };
            // sendLogToServer(logData);
            originalInfo.apply(console, args);
        };

        // Periodically retry sending logs
        // const retryInterval = setInterval(retryLogs, 5000);
        window.console = console;
        return () => {
            // Cleanup: Restore original console methods
            console.log = originalLog;
            console.error = originalError;
            console.warn = originalWarn;
            console.info = originalInfo;
            //   clearInterval(retryInterval);
        };
    }, [isReady]);

    return { isReady, setIsReady };
};

export default useConsoleModification;
