package com.livewatch.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.influxdb.client.domain.WritePrecision;
import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.WriteApi;
import com.livewatch.backend.model.LogEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

import java.time.Instant;

@Service
public class KafkaConsumerService {

    private final InfluxDBClient influxDBClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public KafkaConsumerService(InfluxDBClient influxDBClient, ObjectMapper objectMapper) {
        this.influxDBClient = influxDBClient;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = "livewatch-logs", groupId = "livewatch-group")
    public void consume(String message) {
        try {
            // The Spring-configured ObjectMapper will now correctly handle the Instant
            LogEntry logData = objectMapper.readValue(message, LogEntry.class);

            try (WriteApi writeApi = influxDBClient.getWriteApi()) {
                writeApi.writeMeasurement(WritePrecision.NS, logData);
                System.out.println("Saved to InfluxDB: " + message);
            }
        } catch (Exception e) {
            System.err.println("Error processing message or writing to InfluxDB: " + e.getMessage());
            e.printStackTrace(); // Print stack trace for more details
        }
    }
}
