import React, { useState } from 'react';
import { format } from 'date-fns';
import { LogEntry } from '../api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Typography } from '@mui/material';

interface LogViewerProps {
    logs: LogEntry[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    return (
        <React.Fragment>
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
                Latest Logs
            </Typography>
            <TableContainer component={Paper}>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Timestamp</TableCell>
                            <TableCell>Device ID</TableCell>
                            <TableCell>Level</TableCell>
                            <TableCell>Message</TableCell>
                            <TableCell align="right">CPU (%)</TableCell>
                            <TableCell align="right">Response (ms)</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, index) => (
                            <TableRow key={`${log.timestamp}-${index}`}>
                                <TableCell>{format(new Date(log.timestamp), 'yyyy-MM-dd HH:mm:ss')}</TableCell>
                                <TableCell>{log.deviceId}</TableCell>
                                <TableCell>{log.logLevel}</TableCell>
                                <TableCell>{log.message}</TableCell>
                                <TableCell align="right">{log.cpuUsage}</TableCell>
                                <TableCell align="right">{log.responseTime}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={logs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </React.Fragment>
    );
};

export default LogViewer;
