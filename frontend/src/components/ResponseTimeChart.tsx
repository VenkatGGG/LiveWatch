import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { LogEntry } from '../api';

// Define props and internal chart data types
interface ChartProps {
    data: LogEntry[];
}

interface ChartData extends LogEntry {
    time: Date;
}

const ResponseTimeChart: React.FC<ChartProps> = ({ data }) => {
    // Convert and sort data for the chart
    const chartData: ChartData[] = data.map(log => ({
        ...log,
        time: new Date(log.timestamp),
    })).sort((a, b) => a.time.getTime() - b.time.getTime());

    return (
        <div className="chart-wrapper">
            <h3>Response Time Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="time" 
                        tickFormatter={(time) => format(new Date(time), 'HH:mm:ss')}
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        scale="time"
                    />
                    <YAxis label={{ value: 'ms', angle: -90, position: 'insideLeft' }} />
                    <Tooltip labelFormatter={(label) => format(new Date(label), 'HH:mm:ss')}/>
                    <Legend />
                    <Bar dataKey="responseTime" fill="#82ca9d" name="Response Time" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default ResponseTimeChart;
