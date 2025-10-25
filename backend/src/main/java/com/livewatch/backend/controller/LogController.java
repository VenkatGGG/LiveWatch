package com.livewatch.backend.controller;

import com.livewatch.backend.model.LogEntry;
import com.livewatch.backend.service.LogQueryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.Instant;
import java.util.List;

@RestController
@RequestMapping("/api")
public class LogController {

    @Autowired
    private LogQueryService logQueryService;

    @GetMapping("/logs")
    public ResponseEntity<List<LogEntry>> getLogs(
            @RequestParam(required = false) String deviceId,
            @RequestParam(required = false) String logLevel,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant start,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) Instant end) {
        List<LogEntry> logs = logQueryService.getLatestLogs(deviceId, logLevel, start, end);
        return ResponseEntity.ok(logs);
    }

    @GetMapping("/devices")
    public ResponseEntity<List<String>> getDevices() {
        List<String> devices = logQueryService.getDeviceIds();
        return ResponseEntity.ok(devices);
    }
}
