package com.livewatch.backend.service;

import com.influxdb.client.InfluxDBClient;
import com.influxdb.client.QueryApi;
import com.influxdb.query.FluxRecord;
import com.influxdb.query.FluxTable;
import com.livewatch.backend.model.LogEntry;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class LogQueryService {

    @Autowired
    private InfluxDBClient influxDBClient;

    @Value("${influxdb.bucket}")
    private String bucket;

    public List<LogEntry> getLatestLogs(String deviceId, String logLevel) {
        List<LogEntry> logs = new ArrayList<>();
        String fluxQuery = "from(bucket: \"" + bucket + "\")\n"
                + "  |> range(start: -1h)\n"
                + "  |> filter(fn: (r) => r[\"_measurement\"] == \"logs\")\n";

        if (deviceId != null && !deviceId.isEmpty()) {
            fluxQuery += "  |> filter(fn: (r) => r[\"deviceId\"] == \"" + deviceId + "\")\n";
        }

        if (logLevel != null && !logLevel.isEmpty()) {
            fluxQuery += "  |> filter(fn: (r) => r[\"logLevel\"] == \"" + logLevel + "\")\n";
        }

        fluxQuery += "  |> sort(columns: [\"_time\"], desc: true)\n"
                   + "  |> limit(n: 100)\n"
                   + "  |> pivot(rowKey:[\"_time\"], columnKey: [\"_field\"], valueColumn: \"_value\")";

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        for (FluxTable table : tables) {
            for (FluxRecord record : table.getRecords()) {
                LogEntry entry = new LogEntry();
                entry.setTimestamp(record.getTime());
                entry.setDeviceId((String) record.getValueByKey("deviceId"));
                entry.setLogLevel((String) record.getValueByKey("logLevel"));
                entry.setMessage((String) record.getValueByKey("message"));
                entry.setCpuUsage((Double) record.getValueByKey("cpuUsage"));
                entry.setResponseTime(((Number) record.getValueByKey("responseTime")).intValue());
                logs.add(entry);
            }
        }
        return logs;
    }

    public List<String> getDeviceIds() {
        String fluxQuery = "import \"influxdata/influxdb/schema\"\n"
                + "schema.tagValues(bucket: \"" + bucket + "\", tag: \"deviceId\")";

        QueryApi queryApi = influxDBClient.getQueryApi();
        List<FluxTable> tables = queryApi.query(fluxQuery);

        return tables.stream()
                .flatMap(table -> table.getRecords().stream())
                .map(record -> (String) record.getValue())
                .distinct()
                .collect(Collectors.toList());
    }
}
