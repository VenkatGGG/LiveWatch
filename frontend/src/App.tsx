import React, { useState, useEffect, useCallback } from 'react';
import { getLogs, getDevices, LogEntry } from './api'; // Import LogEntry type
import LogViewer from './components/LogViewer';
import CpuUsageChart from './components/CpuUsageChart';
import ResponseTimeChart from './components/ResponseTimeChart';

const App: React.FC = () => {
    // Type the state variables
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [devices, setDevices] = useState<string[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const logsResponse = await getLogs(selectedDevice, selectedLevel);
            setLogs(logsResponse.data);

            const devicesResponse = await getDevices();
            setDevices(devicesResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedDevice, selectedLevel]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleRefresh = () => {
        fetchData();
    };

    // Type the event for the select handlers
    const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedDevice(e.target.value);
    };

    const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedLevel(e.target.value);
    };

    return (
        <div className="App">
            <h1>LiveWatch Dashboard</h1>

            <div className="dashboard-controls">
                <div className="filters">
                    <select value={selectedDevice} onChange={handleDeviceChange}>
                        <option value="">All Devices</option>
                        {devices.map(device => (
                            <option key={device} value={device}>{device}</option>
                        ))}
                    </select>
                    <select value={selectedLevel} onChange={handleLevelChange}>
                        <option value="">All Log Levels</option>
                        <option value="INFO">INFO</option>
                        <option value="WARN">WARN</option>
                        <option value="ERROR">ERROR</option>
                        <option value="DEBUG">DEBUG</option>
                    </select>
                </div>
                <button onClick={handleRefresh} disabled={loading} className="refresh-btn">
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            <div className="charts-container">
                <CpuUsageChart data={logs} />
                <ResponseTimeChart data={logs} />
            </div>

            <LogViewer logs={logs} />
        </div>
    );
}

export default App;
