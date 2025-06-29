import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { LogEntry } from '../api';

// Define props and internal chart data types
interface ChartProps {
    data: LogEntry[];
}

interface ChartData extends LogEntry {
    time: Date;
}

const CpuUsageChart: React.FC<ChartProps> = ({ data }) => {
    // Convert and sort data for the chart
    const chartData: ChartData[] = data.map(log => ({
        ...log,
        time: new Date(log.timestamp),
    })).sort((a, b) => a.time.getTime() - b.time.getTime());

    return (
        <div className="chart-wrapper">
            <h3>CPU Usage Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="time" 
                        tickFormatter={(time) => format(new Date(time), 'HH:mm:ss')}
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        scale="time"
                    />
                    <YAxis domain={[0, 100]} label={{ value: '%', angle: -90, position: 'insideLeft' }} />
                    <Tooltip labelFormatter={(label) => format(new Date(label), 'HH:mm:ss')}/>
                    <Legend />
                    <Line type="monotone" dataKey="cpuUsage" stroke="#8884d8" name="CPU Usage" dot={false} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default CpuUsageChart;
