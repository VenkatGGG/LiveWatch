import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';
import { LogEntry } from '../api';
import { useTheme, Typography } from '@mui/material';

// Define props and internal chart data types
interface ChartProps {
    data: LogEntry[];
}

interface ChartData extends LogEntry {
    time: Date;
}

const ResponseTimeChart: React.FC<ChartProps> = ({ data }) => {
    const theme = useTheme();

    // Convert and sort data for the chart
    const chartData: ChartData[] = data.map(log => ({
        ...log,
        time: new Date(log.timestamp),
    })).sort((a, b) => a.time.getTime() - b.time.getTime());

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Response Time Over Time
            </Typography>
            <ResponsiveContainer>
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="time"
                        tickFormatter={(time) => format(new Date(time), 'HH:mm:ss')}
                        type="number"
                        domain={['dataMin', 'dataMax']}
                        scale="time"
                        stroke={theme.palette.text.secondary}
                    />
                    <YAxis stroke={theme.palette.text.secondary}>
                        <label
                            x={0}
                            y={0}
                            dx={-10}
                            dy={150}
                            offset={0}
                            angle={-90}
                            fill={theme.palette.text.primary}
                        >
                            Response Time (ms)
                        </label>
                    </YAxis>
                    <Tooltip
                        labelFormatter={(label) => format(new Date(label), 'HH:mm:ss')}
                        contentStyle={{ backgroundColor: theme.palette.background.paper }}
                    />
                    <Legend />
                    <Bar dataKey="responseTime" fill={theme.palette.secondary.main} name="Response Time" />
                </BarChart>
            </ResponsiveContainer>
        </React.Fragment>
    );
};

export default ResponseTimeChart;
