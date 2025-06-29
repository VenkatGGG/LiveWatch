import React from 'react';
import { format } from 'date-fns';
import { LogEntry } from '../api'; // Import the type

// Define the props type for this component
interface LogViewerProps {
    logs: LogEntry[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
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
                            // Use a more robust key than just the index
                            <tr key={`${log.timestamp}-${index}`}>
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
