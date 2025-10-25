import React from 'react';
import { TextField } from '@mui/material';

interface DateRangePickerProps {
    start: Date | null;
    end: Date | null;
    onStartChange: (date: Date | null) => void;
    onEndChange: (date: Date | null) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ start, end, onStartChange, onEndChange }) => {
    return (
        <React.Fragment>
            <TextField
                label="Start Time"
                type="datetime-local"
                value={start ? start.toISOString().slice(0, 16) : ''}
                onChange={(e) => onStartChange(new Date(e.target.value))}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <TextField
                label="End Time"
                type="datetime-local"
                value={end ? end.toISOString().slice(0, 16) : ''}
                onChange={(e) => onEndChange(new Date(e.target.value))}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </React.Fragment>
    );
};

export default DateRangePicker;
