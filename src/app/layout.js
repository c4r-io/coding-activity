import './css/globals.css';
// import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
// import { Analytics } from '@vercel/analytics/react'; 
// import { SpeedInsights } from '@vercel/speed-insights/next'; 
import 'react-toastify/dist/ReactToastify.css';
import Link from 'next/link';
import { AllContextProviders } from '@/contextapi/AllContextProviders';
// const inter = Inter({ subsets: ['latin'] });
export const metadata = {
  title: 'Coding Activity',
  description: 'Coding Activity description',
};
const overRideConsoleScript = `
<script>
(function() {
  // Store original console methods
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;
  const originalInfo = console.info;

  // Function to send log data to the backend
  function sendLogToServer(logData) {
    // fetch('https://your-backend-server.com/api/logs', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(logData)
    // })
    // .catch(error => {
    //   originalError('Failed to send log to server:', error);
    // });
  }

  // Override console.log
  console.log = function(...args) {
    const logData = { type: 'log', message: args, timestamp: new Date().toISOString() };
    sendLogToServer(logData);
    originalLog.apply(console, args);
  };

  // Override console.error
  console.error = function(...args) {
    const logData = { type: 'error', message: args, timestamp: new Date().toISOString() };
    sendLogToServer(logData);
    originalError.apply(console, args);
  };

  // Override console.warn
  console.warn = function(...args) {
    const logData = { type: 'warn', message: args, timestamp: new Date().toISOString() };
    sendLogToServer(logData);
    originalWarn.apply(console, args);
  };

  // Override console.info
  console.info = function(...args) {
    const logData = { type: 'info', message: args, timestamp: new Date().toISOString() };
    sendLogToServer(logData);
    originalInfo.apply(console, args);
  };

  // Function to get the captured log messages (optional)
  window.getConsoleLogs = function() {
    return logBuffer;
  };
})();
</script>
`;
export default function RootLayout({ children }) {
  return (
    <html lang="en" className='dark'>
      <body className={``}>
        <div dangerouslySetInnerHTML={{__html: overRideConsoleScript}}></div>
        <AllContextProviders>
          {children}
          <ToastContainer />
        </AllContextProviders>
        {/* <Analytics />
        <SpeedInsights /> */}
      </body>
    </html>
  );
}
