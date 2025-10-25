# LiveWatch

A scalable real-time monitoring platform using Java, React, Kafka, and InfluxDB.

LiveWatch is a comprehensive monitoring solution that provides real-time insights into your systems. It's designed to be scalable and extensible, making it suitable for a wide range of applications.

## Features

*   **Real-time Monitoring:** View live data from your systems as it happens. The frontend uses Server-Sent Events (SSE) to provide a real-time stream of log data.
*   **Scalable Data Pipeline:** The backend is built on a scalable architecture using Kafka for data ingestion and InfluxDB for time-series data storage.
*   **Rich Data Visualization:** The frontend provides a rich user interface for visualizing log data, including charts for CPU usage and response time.
*   **Flexible API:** The backend provides a flexible API for querying log data, including the ability to filter by device ID, log level, and time range.

## Architecture

The application is divided into three main components:

*   **Producers:** These are simple Java applications that simulate log data from different devices and send it to a Kafka topic.
*   **Backend:** A Spring Boot application that consumes log data from Kafka, stores it in InfluxDB, and provides a REST API for querying the data. It also includes an SSE endpoint for real-time updates.
*   **Frontend:** A React application that visualizes the log data in a dashboard. It uses the REST API to fetch historical data and the SSE endpoint to receive real-time updates.

## Getting Started

To run the application, you will need to have Docker and Docker Compose installed. Then, you can simply run the following command:

```
docker-compose up
```

This will start all the required services, including Kafka, InfluxDB, the backend, and the frontend.

## API Reference

The backend provides the following API endpoints:

*   `GET /api/logs`

    *   Description: Get the latest logs.
    *   Query Parameters:
        *   `deviceId` (optional): Filter by device ID.
        *   `logLevel` (optional): Filter by log level.
        *   `start` (optional): The start of the time range in ISO 8601 format.
        *   `end` (optional): The end of the time range in ISO 8601 format.

*   `GET /api/devices`

    *   Description: Get a list of all device IDs.

*   `GET /api/sse`

    *   Description: Establish an SSE connection to receive real-time log updates.