package com.livewatch.producers;

import com.fasterxml.jackson.annotation.JsonProperty;

public class LogData {

    @JsonProperty("deviceId")
    private String deviceId;

    @JsonProperty("timestamp")
    private long timestamp;

    @JsonProperty("logLevel")
    private String logLevel;

    @JsonProperty("message")
    private String message;

    @JsonProperty("cpuUsage")
    private double cpuUsage;

    @JsonProperty("responseTime")
    private int responseTime;

    // Getters and Setters

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getLogLevel() {
        return logLevel;
    }

    public void setLogLevel(String logLevel) {
        this.logLevel = logLevel;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public double getCpuUsage() {
        return cpuUsage;
    }

    public void setCpuUsage(double cpuUsage) {
        this.cpuUsage = cpuUsage;
    }

    public int getResponseTime() {
        return responseTime;
    }

    public void setResponseTime(int responseTime) {
        this.responseTime = responseTime;
    }
}
