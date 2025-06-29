import React from 'react';
import { format } from 'date-fns';

const LogViewer = ({ logs }) => {
    return (
        <div className="log-viewer-container">
            <h2>Latest Logs</h2>
            <div className="log-table-wrapper">
                <table>
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Device ID</th>
                            <th>Level</th>
                            <th>Message</th>
                            <th>CPU (%)</th>
                            <th>Response (ms)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {logs.map((log, index) => (
                            <tr key={index}>
                                <td>{format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}</td>
                                <td>{log.deviceId}</td>
                                <td>{log.logLevel}</td>
                                <td>{log.message}</td>
                                <td>{log.cpuUsage}</td>
                                <td>{log.responseTime}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default LogViewer;
