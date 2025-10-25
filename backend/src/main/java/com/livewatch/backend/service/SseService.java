package com.livewatch.backend.service;

import com.livewatch.backend.model.LogEntry;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {

    private final CopyOnWriteArrayList<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public void addEmitter(SseEmitter emitter) {
        this.emitters.add(emitter);
        emitter.onCompletion(() -> this.emitters.remove(emitter));
        emitter.onTimeout(() -> this.emitters.remove(emitter));
    }

    public void sendSseEvent(LogEntry logEntry) {
        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event().name("new-log").data(logEntry));
            } catch (IOException e) {
                // This can happen if the client disconnects
                // The onCompletion callback will remove the emitter
                System.err.println("Error sending SSE event: " + e.getMessage());
            }
        }
    }
}
