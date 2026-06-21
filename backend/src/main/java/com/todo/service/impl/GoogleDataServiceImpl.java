package com.todo.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleRefreshTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.todo.dto.*;
import com.todo.entity.User;
import com.todo.exception.ResourceNotFoundException;
import com.todo.exception.UnauthorizedException;
import com.todo.repository.UserRepository;
import com.todo.service.GoogleDataService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class GoogleDataServiceImpl implements GoogleDataService {

    private final UserRepository userRepository;
    private final String googleClientId;
    private final String googleClientSecret;
    private final RestTemplate restTemplate;

    public GoogleDataServiceImpl(UserRepository userRepository,
                                 @Value("${todo.google.client-id}") String googleClientId,
                                 @Value("${todo.google.client-secret}") String googleClientSecret) {
        this.userRepository = userRepository;
        this.googleClientId = googleClientId;
        this.googleClientSecret = googleClientSecret;
        this.restTemplate = new RestTemplate();
    }

    @Override
    @Transactional
    public GoogleDashboardDataDto getDashboardData(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (!user.isGoogleSynced() || user.getGoogleRefreshToken() == null) {
            throw new UnauthorizedException("User is not synced with Google or missing refresh token");
        }

        String accessToken = getValidAccessToken(user);

        List<GoogleCalendarEventDto> events = fetchCalendarEvents(accessToken);
        GoogleYouTubeStatsDto youtubeStats = fetchYouTubeStats(accessToken);
        List<GoogleMailDto> unreadEmails = fetchUnreadEmails(accessToken);

        return new GoogleDashboardDataDto(events, youtubeStats, unreadEmails);
    }

    private String getValidAccessToken(User user) {
        try {
            // Test the current access token
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(user.getGoogleAccessToken());
            restTemplate.exchange("https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=" + user.getGoogleAccessToken(), HttpMethod.GET, new HttpEntity<>(headers), String.class);
            return user.getGoogleAccessToken();
        } catch (HttpClientErrorException.Unauthorized | HttpClientErrorException.BadRequest e) {
            // Token expired, refresh it
            try {
                GoogleTokenResponse response = new GoogleRefreshTokenRequest(
                        new NetHttpTransport(), new GsonFactory(),
                        user.getGoogleRefreshToken(),
                        googleClientId,
                        googleClientSecret).execute();
                
                user.setGoogleAccessToken(response.getAccessToken());
                userRepository.save(user);
                return response.getAccessToken();
            } catch (Exception ex) {
                throw new UnauthorizedException("Failed to refresh Google token: " + ex.getMessage());
            }
        }
    }

    private List<GoogleCalendarEventDto> fetchCalendarEvents(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            String timeMin = Instant.now().toString();
            String timeMax = Instant.now().plus(7, ChronoUnit.DAYS).toString();
            
            String url = String.format("https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=%s&timeMax=%s&maxResults=5&singleEvents=true&orderBy=startTime", timeMin, timeMax);
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
            List<Map<String, Object>> items = (List<Map<String, Object>>) response.getBody().get("items");
            
            List<GoogleCalendarEventDto> events = new ArrayList<>();
            if (items != null) {
                for (Map<String, Object> item : items) {
                    Map<String, Object> start = (Map<String, Object>) item.get("start");
                    Map<String, Object> end = (Map<String, Object>) item.get("end");
                    
                    String startTime = start != null ? (String) start.getOrDefault("dateTime", start.get("date")) : "";
                    String endTime = end != null ? (String) end.getOrDefault("dateTime", end.get("date")) : "";
                    
                    events.add(new GoogleCalendarEventDto(
                            (String) item.get("id"),
                            (String) item.get("summary"),
                            startTime,
                            endTime,
                            (String) item.get("htmlLink")
                    ));
                }
            }
            return events;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>(); // Return empty if error (e.g. scopes not granted)
        }
    }

    private GoogleYouTubeStatsDto fetchYouTubeStats(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            String url = "https://youtube.googleapis.com/youtube/v3/channels?part=snippet,statistics&mine=true";
            
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
            List<Map<String, Object>> items = (List<Map<String, Object>>) response.getBody().get("items");
            
            if (items != null && !items.isEmpty()) {
                Map<String, Object> item = items.get(0);
                Map<String, Object> snippet = (Map<String, Object>) item.get("snippet");
                Map<String, Object> statistics = (Map<String, Object>) item.get("statistics");
                
                return new GoogleYouTubeStatsDto(
                        (String) snippet.get("title"),
                        (String) statistics.get("subscriberCount"),
                        (String) statistics.get("viewCount"),
                        (String) statistics.get("videoCount")
                );
            }
            return null;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private List<GoogleMailDto> fetchUnreadEmails(String accessToken) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(accessToken);
            
            String url = "https://gmail.googleapis.com/gmail/v1/users/me/messages?q=in:inbox&maxResults=5";
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
            List<Map<String, Object>> messages = (List<Map<String, Object>>) response.getBody().get("messages");
            
            List<GoogleMailDto> emails = new ArrayList<>();
            if (messages != null) {
                for (Map<String, Object> msg : messages) {
                    String msgId = (String) msg.get("id");
                    String msgUrl = "https://gmail.googleapis.com/gmail/v1/users/me/messages/" + msgId + "?format=metadata&metadataHeaders=Subject&metadataHeaders=From";
                    
                    try {
                        ResponseEntity<Map> msgResponse = restTemplate.exchange(msgUrl, HttpMethod.GET, new HttpEntity<>(headers), Map.class);
                        Map<String, Object> msgData = msgResponse.getBody();
                        
                        String snippet = (String) msgData.get("snippet");
                        Map<String, Object> payload = (Map<String, Object>) msgData.get("payload");
                        List<Map<String, String>> msgHeaders = (List<Map<String, String>>) payload.get("headers");
                        
                        String subject = "";
                        String sender = "";
                        String date = "";
                        
                        for (Map<String, String> h : msgHeaders) {
                            if ("Subject".equalsIgnoreCase(h.get("name"))) subject = h.get("value");
                            if ("From".equalsIgnoreCase(h.get("name"))) sender = h.get("value");
                            if ("Date".equalsIgnoreCase(h.get("name"))) date = h.get("value");
                        }
                        
                        emails.add(new GoogleMailDto(msgId, snippet, subject, sender, date));
                    } catch (Exception ignored) {}
                }
            }
            return emails;
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }
}
