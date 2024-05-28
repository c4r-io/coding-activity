import dynamic from 'next/dynamic'

const CodeExecutorActivityView = dynamic(() => import('@/components/coding-activity/CodeExecutorActivityView'), {
  ssr: false,
})
// get data server side and render it on client side
const getCodeExecutorActivityData = async (id) => {
  const res = await fetch(`${process.env.PRODUCTION_URL}/api/coding-activity/${id}`, {
    // next: { revalidate: 1 },
    cache: 'no-store'
  })
  if (!res.ok) {
    return {}
  }
  return res.json()
}
const Page = async ({ params }) => {
  let data;
  try {
    const response = await getCodeExecutorActivityData(params.codingActivityId)
    data = response.results
    // console.log('response ', data)
  } catch (error) {
    console.error("error getting styles", error)
  }

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
    const clientAnalyticsSessionExist = sessionStorage.getItem('client-analytics-session-id');
    if (!clientAnalyticsSessionExist) {
      return
    }
    const bodyData = {consoleIssue: JSON.stringify(logData)};
    let origin = location.origin;
    fetch(\`\${origin}/api/analytics/\${clientAnalyticsSessionExist}\`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bodyData)
    })
    .catch(error => {
      originalError('Failed to send log to server:', error);
    });
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
  return (
    <div className="w-full flex justify-center py-4">
      <div dangerouslySetInnerHTML={{ __html: overRideConsoleScript }}></div>
      <CodeExecutorActivityView codingActivityId={params.codingActivityId} uiDataFromDb={data} />
    </div>
  );
};
export default Page;
