package com.livewatch.backend.model;

import com.influxdb.annotations.Column;
import com.influxdb.annotations.Measurement;
import lombok.Data;

import java.time.Instant;

@Data
@Measurement(name = "logs")
public class LogEntry {

    @Column(tag = true)
    private String deviceId;

    @Column(tag = true)
    private String logLevel;

    @Column
    private String message;

    @Column
    private Double cpuUsage;

    @Column
    private Integer responseTime;

    @Column(timestamp = true)
    private Instant timestamp;
}
