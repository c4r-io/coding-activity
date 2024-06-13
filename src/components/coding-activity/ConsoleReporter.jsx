"use client";
import React, { useEffect, useState } from "react";
import { getLogMessages } from "ashra-log";
// import useConsoleModification from '../hooks/useConsoleModification';

const ConsoleReporter = () => {
    // useConsoleModification()
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        fetch(
            `https://jsonplaceholder.typicode.com/post/${Math.floor(
                Math.random() * 100
            )}`
        )
            .then((respnose) => respnose.json())
            .then((data) => console.log(data))
            .catch((error) => console.error(error));
    }, []);

    const handleClick = () => {
        const logs = getLogMessages(false);
        setLogs(logs);
        //   alert(JSON.stringify(logs, null, 2)); // Display logs as an alert (you can customize this as needed)
    };

    return (
        <div>
            {/* <button onClick={handleClick}>Click Me</button>
        <div>
          {logs.map((log, index) => (
            <div key={index}>
              <strong className="white-space-pre">{JSON.stringify(log)}</strong>
            </div>
          ))}
        </div> */}
        </div>
    );
}

export default ConsoleReporter
