package com.livewatch.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApi;
import com.livewatch.backend.model.LogEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class KafkaConsumerService {

    @Autowired
    private InfluxDBClient influxDBClient;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @KafkaListener(topics = "livewatch-logs", groupId = "livewatch-group")
    public void consume(String message) {
        try {
            LogEntry logData = objectMapper.readValue(message, LogEntry.class);

            // The JSON from producer has a timestamp in milliseconds, convert it to Instant
            long timestampMillis = objectMapper.readTree(message).get("timestamp").asLong();
            logData.setTimestamp(Instant.ofEpochMilli(timestampMillis));

            try (WriteApi writeApi = influxDBClient.getWriteApi()) {
                writeApi.writeMeasurement(logData);
                System.out.println("Saved to InfluxDB: " + message);
            }
        } catch (Exception e) {
            System.err.println("Error processing message or writing to InfluxDB: " + e.getMessage());
        }
    }
}
