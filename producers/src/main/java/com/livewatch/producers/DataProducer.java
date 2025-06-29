package com.livewatch.producers;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.kafka.clients.producer.KafkaProducer;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.clients.producer.ProducerRecord;
import org.apache.kafka.common.serialization.StringSerializer;

import java.util.Properties;
import java.util.Random;
import java.util.concurrent.TimeUnit;

public class DataProducer {

    private static final String KAFKA_BROKER = "localhost:9092";
    private static final String TOPIC_NAME = "livewatch-logs";
    private static final String[] LOG_LEVELS = {"INFO", "WARN", "ERROR", "DEBUG"};
    private static final Random RANDOM = new Random();

    public static void main(String[] args) throws InterruptedException {
        if (args.length == 0) {
            System.out.println("Usage: java -jar <jar-file-name>.jar <deviceId>");
            System.exit(1);
        }
        String deviceId = args[0];

        Properties props = new Properties();
        props.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, KAFKA_BROKER);
        props.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());
        props.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, StringSerializer.class.getName());

        try (KafkaProducer<String, String> producer = new KafkaProducer<>(props)) {
            ObjectMapper objectMapper = new ObjectMapper();

            System.out.println("Starting data producer for device: " + deviceId);
            while (true) {
                LogData logData = new LogData();
                logData.setDeviceId(deviceId);
                logData.setTimestamp(System.currentTimeMillis());
                logData.setLogLevel(LOG_LEVELS[RANDOM.nextInt(LOG_LEVELS.length)]);
                logData.setCpuUsage(Math.round(RANDOM.nextDouble() * 10000.0) / 100.0); // e.g., 45.67
                logData.setResponseTime(RANDOM.nextInt(500) + 50); // 50-550ms
                logData.setMessage("Service status is normal. Response time: " + logData.getResponseTime() + "ms.");

                String jsonLog = objectMapper.writeValueAsString(logData);
                ProducerRecord<String, String> record = new ProducerRecord<>(TOPIC_NAME, deviceId, jsonLog);

                producer.send(record, (metadata, exception) -> {
                    if (exception != null) {
                        System.err.println("Error sending message: " + exception.getMessage());
                    } else {
                        System.out.println("Sent message to topic=" + metadata.topic() + ", partition=" + metadata.partition() + ", offset=" + metadata.offset());
                    }
                });

                TimeUnit.SECONDS.sleep(2);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
