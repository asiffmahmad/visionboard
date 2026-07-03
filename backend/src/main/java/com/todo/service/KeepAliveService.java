package com.todo.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;

@Service
public class KeepAliveService {

    private static final Logger logger = LoggerFactory.getLogger(KeepAliveService.class);
    private static final String APP_URL = "https://todo-backend-bggj.onrender.com/api/health";

    // 3 minutes = 180000 milliseconds
    @Scheduled(fixedRate = 180000)
    public void pingServer() {
        try {
            URL url = new URL(APP_URL);
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(5000);
            connection.setReadTimeout(5000);
            connection.connect();
            
            int responseCode = connection.getResponseCode();
            if (responseCode == 200) {
                logger.info("Successfully pinged keep-alive endpoint. Status: 200 OK");
            } else {
                logger.warn("Keep-alive ping returned non-200 status: {}", responseCode);
            }
        } catch (Exception e) {
            logger.error("Failed to ping keep-alive endpoint: {}", e.getMessage());
        }
    }
}
