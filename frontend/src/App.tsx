import React, { useState, useEffect, useCallback } from 'react';
import { getLogs, getDevices, LogEntry } from './api';
import LogViewer from './components/LogViewer';
import CpuUsageChart from './components/CpuUsageChart';
import ResponseTimeChart from './components/ResponseTimeChart';
import DateRangePicker from './components/DateRangePicker';
import { ThemeProvider, CssBaseline, AppBar, Toolbar, Typography, Container, Grid, Paper, Select, MenuItem, FormControl, InputLabel, Switch, FormGroup, FormControlLabel, Button } from '@mui/material';
import { lightTheme, darkTheme } from './theme';
import { SelectChangeEvent } from '@mui/material';

const App: React.FC = () => {
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [devices, setDevices] = useState<string[]>([]);
    const [selectedDevice, setSelectedDevice] = useState<string>('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [darkMode, setDarkMode] = useState<boolean>(false);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const logsResponse = await getLogs(selectedDevice, selectedLevel, startDate, endDate);
            setLogs(logsResponse.data);

            const devicesResponse = await getDevices();
            setDevices(devicesResponse.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [selectedDevice, selectedLevel, startDate, endDate]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:8080/api/sse');
        eventSource.onmessage = (event) => {
            const newLog = JSON.parse(event.data);
            setLogs((prevLogs) => [newLog, ...prevLogs]);
        };
        return () => {
            eventSource.close();
        };
    }, []);

    const handleDeviceChange = (event: SelectChangeEvent) => {
        setSelectedDevice(event.target.value as string);
    };

    const handleLevelChange = (event: SelectChangeEvent) => {
        setSelectedLevel(event.target.value as string);
    };

    const handleThemeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDarkMode(event.target.checked);
    };

    return (
        <ThemeProvider theme={darkMode ? darkTheme : lightTheme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        LiveWatch Dashboard
                    </Typography>
                    <FormGroup>
                        <FormControlLabel
                            control={<Switch checked={darkMode} onChange={handleThemeChange} />}
                            label="Dark Mode"
                        />
                    </FormGroup>
                </Toolbar>
            </AppBar>
            <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6">Filters</Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Device</InputLabel>
                                        <Select value={selectedDevice} label="Device" onChange={handleDeviceChange}>
                                            <MenuItem value=""><em>All Devices</em></MenuItem>
                                            {devices.map(device => (
                                                <MenuItem key={device} value={device}>{device}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <FormControl fullWidth>
                                        <InputLabel>Log Level</InputLabel>
                                        <Select value={selectedLevel} label="Log Level" onChange={handleLevelChange}>
                                            <MenuItem value=""><em>All Log Levels</em></MenuItem>
                                            <MenuItem value="INFO">INFO</MenuItem>
                                            <MenuItem value="WARN">WARN</MenuItem>
                                            <MenuItem value="ERROR">ERROR</MenuItem>
                                            <MenuItem value="DEBUG">DEBUG</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <DateRangePicker start={startDate} end={endDate} onStartChange={setStartDate} onEndChange={setEndDate} />
                                </Grid>
                            </Grid>
                            <Button variant="contained" onClick={fetchData} sx={{ mt: 2 }}>Apply Filter</Button>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                            <CpuUsageChart data={logs} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 400 }}>
                            <ResponseTimeChart data={logs} />
                        </Paper>
                    </Grid>
                    <Grid item xs={12}>
                        <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                            <LogViewer logs={logs} />
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
        </ThemeProvider>
    );
}

export default App;
