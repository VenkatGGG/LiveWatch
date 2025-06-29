import React, { useState, useEffect, useCallback } from 'react';
import { getLogs, getDevices } from './api';
import LogViewer from './components/LogViewer';
import CpuUsageChart from './components/CpuUsageChart';
import ResponseTimeChart from './components/ResponseTimeChart';

function App() {
    const [logs, setLogs] = useState([]);
    const [devices, setDevices] = useState([]);
    const [selectedDevice, setSelectedDevice] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [loading, setLoading] = useState(false);

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

    return (
        <div className="App">
            <h1>LiveWatch Dashboard</h1>

            <div className="dashboard-controls">
                <div className="filters">
                    <select value={selectedDevice} onChange={(e) => setSelectedDevice(e.target.value)}>
                        <option value="">All Devices</option>
                        {devices.map(device => (
                            <option key={device} value={device}>{device}</option>
                        ))}
                    </select>
                    <select value={selectedLevel} onChange={(e) => setSelectedLevel(e.target.value)}>
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
