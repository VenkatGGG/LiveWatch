import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const ResponseTimeChart = ({ data }) => {
    const chartData = data.map(log => ({
        ...log,
        time: new Date(log.timestamp),
    })).sort((a, b) => a.time - b.time);

    return (
        <div className="chart-wrapper">
            <h3>Response Time Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                        dataKey="time" 
                        tickFormatter={(time) => format(time, 'HH:mm:ss')}
                        type="number"
                        domain={['dataMin', 'dataMax']}
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
