import axios from 'axios';

// Define the shape of a log entry to be used across the frontend
export interface LogEntry {
    deviceId: string;
    logLevel: string;
    message: string;
    cpuUsage: number;
    responseTime: number;
    timestamp: string; // ISO 8601 string from backend
}

const API_BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
});

// Type the function arguments and the expected generic return type from Axios
export const getLogs = (deviceId: string, logLevel: string, start: Date | null, end: Date | null) => {
    return apiClient.get<LogEntry[]>('/logs', {
        params: { 
            deviceId, 
            logLevel, 
            start: start?.toISOString(), 
            end: end?.toISOString() 
        },
    });
};

export const getDevices = () => {
    return apiClient.get<string[]>('/devices');
};
