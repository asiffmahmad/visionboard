package com.todo.controller;

import com.todo.dto.DashboardStatsDto;
import com.todo.dto.GoogleDashboardDataDto;
import com.todo.security.UserPrincipal;
import com.todo.service.DashboardStatsService;
import com.todo.service.GoogleDataService;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardStatsService dashboardStatsService;
    private final GoogleDataService googleDataService;

    @Value("${todo.linkedin.session-cookie:}")
    private String linkedinSessionCookie;

    @Value("${todo.instagram.session-cookie:}")
    private String instagramSessionCookie;

    public DashboardController(DashboardStatsService dashboardStatsService, GoogleDataService googleDataService) {
        this.dashboardStatsService = dashboardStatsService;
        this.googleDataService = googleDataService;
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDto> getStats(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(dashboardStatsService.getStats(userPrincipal.getId()));
    }

    @GetMapping("/google-data")
    public ResponseEntity<GoogleDashboardDataDto> getGoogleData(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(googleDataService.getDashboardData(userPrincipal.getId()));
    }

    private String fetchFollowersFromYahoo(String query, String targetPlatform) {
        try {
            String searchUrl = "https://search.yahoo.com/search?p=" + java.net.URLEncoder.encode(query, "UTF-8");
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");

            HttpEntity<String> entity = new HttpEntity<>(headers);
            RestTemplate restTemplate = new RestTemplate();

            ResponseEntity<String> response = restTemplate.exchange(
                searchUrl,
                HttpMethod.GET,
                entity,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                String html = response.getBody();
                Pattern pattern = Pattern.compile("(\\b\\d+(?:[.,]\\d+)*[K|M|B|m]?)\\s*(?:[a-zA-Z]+\\s+)?followers", Pattern.CASE_INSENSITIVE);
                Matcher matcher = pattern.matcher(html);
                while (matcher.find()) {
                    String matchVal = matcher.group(1);
                    if (matchVal != null && !matchVal.trim().isEmpty()) {
                        return matchVal.trim();
                    }
                }
            }
        } catch (Exception e) {
            System.err.println("Yahoo search fallback failed for " + query + ": " + e.getMessage());
        }
        return null;
    }

    @GetMapping("/linkedin-followers")
    public ResponseEntity<?> getLinkedInFollowers(
            @AuthenticationPrincipal UserPrincipal userPrincipal, 
            @RequestParam String username) {
        try {
            String slug = java.net.URLEncoder.encode(username, "UTF-8");
            if (slug.contains("linkedin.com/in/")) {
                slug = slug.substring(slug.indexOf("linkedin.com/in/") + "linkedin.com/in/".length());
            }
            if (slug.contains("?")) {
                slug = slug.split("\\?")[0];
            }
            if (slug.contains("/")) {
                slug = slug.split("/")[0];
            }
            slug = slug.trim();

            if (slug.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid username or URL");
            }

            // 1. Try direct scraping
            try {
                String url = "https://www.linkedin.com/in/" + slug;
                HttpHeaders headers = new HttpHeaders();
                headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
                
                String activeCookie = linkedinSessionCookie;
                if (activeCookie != null && !activeCookie.trim().isEmpty()) {
                    headers.set("Cookie", "li_at=" + activeCookie.trim());
                    System.out.println("Scraping LinkedIn profile with session cookie bypass for user: " + slug);
                }
                HttpEntity<String> entity = new HttpEntity<>(headers);
                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    String html = response.getBody();
                    Pattern pattern = Pattern.compile("(\\b\\d+(?:[.,]\\d+)*[K|M|B|m]?)\\s*(?:[a-zA-Z]+\\s+)?followers", Pattern.CASE_INSENSITIVE);
                    Matcher matcher = pattern.matcher(html);
                    if (matcher.find()) {
                        return ResponseEntity.ok(Map.of("username", slug, "followers", matcher.group(1)));
                    }
                }
            } catch (Exception e) {
                System.out.println("Direct LinkedIn scraping failed for " + slug + ", trying Yahoo search fallback... Error: " + e.getMessage());
            }

            // 2. Try Yahoo search fallback
            String yahooFollowers = fetchFollowersFromYahoo(slug + " linkedin followers", "linkedin");
            if (yahooFollowers != null) {
                return ResponseEntity.ok(Map.of("username", slug, "followers", yahooFollowers));
            }

            return ResponseEntity.status(404).body("Followers count not found in public profile or web search");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching LinkedIn profile: " + e.getMessage());
        }
    }

    @GetMapping("/instagram-followers")
    public ResponseEntity<?> getInstagramFollowers(
            @AuthenticationPrincipal UserPrincipal userPrincipal, 
            @RequestParam String username) {
        try {
            String handle = java.net.URLEncoder.encode(username.replace("@", "").trim(), "UTF-8");
            if (handle.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid handle");
            }

            // 1. Try public JSON API endpoint
            try {
                String apiUrl = "https://www.instagram.com/api/v1/users/web_profile_info/?username=" + handle;
                HttpHeaders headers = new HttpHeaders();
                headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
                headers.set("x-ig-app-id", "936619743392459");
                
                String activeCookie = instagramSessionCookie;
                if (activeCookie != null && !activeCookie.trim().isEmpty()) {
                    headers.set("Cookie", "sessionid=" + activeCookie.trim());
                }
                
                HttpEntity<String> entity = new HttpEntity<>(headers);
                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    String json = response.getBody();
                    Pattern pattern = Pattern.compile("\"edge_followed_by\"\\s*:\\s*\\{\\s*\"count\"\\s*:\\s*(\\d+)\\s*\\}", Pattern.CASE_INSENSITIVE);
                    Matcher matcher = pattern.matcher(json);
                    if (matcher.find()) {
                        System.out.println("Successfully fetched Instagram followers for " + handle + " via web API: " + matcher.group(1));
                        return ResponseEntity.ok(Map.of("username", handle, "followers", matcher.group(1)));
                    }
                }
            } catch (Exception e) {
                System.out.println("Instagram JSON API fetch failed for " + handle + ": " + e.getMessage());
            }

            // 2. Try direct scraping
            try {
                String url = "https://www.instagram.com/" + handle + "/";
                HttpHeaders headers = new HttpHeaders();
                headers.set("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36");
                
                String activeCookie = instagramSessionCookie;
                if (activeCookie != null && !activeCookie.trim().isEmpty()) {
                    headers.set("Cookie", "sessionid=" + activeCookie.trim());
                    System.out.println("Scraping Instagram profile with session cookie bypass for user: " + handle);
                }
                HttpEntity<String> entity = new HttpEntity<>(headers);
                RestTemplate restTemplate = new RestTemplate();
                ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

                if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                    String html = response.getBody();
                    Pattern pattern = Pattern.compile("(\\b\\d+(?:[.,]\\d+)*[K|M|B|m]?)\\s*(?:[a-zA-Z]+\\s+)?followers", Pattern.CASE_INSENSITIVE);
                    Matcher matcher = pattern.matcher(html);
                    if (matcher.find()) {
                        return ResponseEntity.ok(Map.of("username", handle, "followers", matcher.group(1)));
                    }
                }
            } catch (Exception e) {
                System.out.println("Direct Instagram scraping failed for " + handle + ", trying Yahoo search fallback... Error: " + e.getMessage());
            }

            // 2. Try Yahoo search fallback
            String yahooFollowers = fetchFollowersFromYahoo(handle + " instagram followers", "instagram");
            if (yahooFollowers != null) {
                return ResponseEntity.ok(Map.of("username", handle, "followers", yahooFollowers));
            }

            return ResponseEntity.status(404).body("Followers count not found in public profile or web search");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error fetching Instagram profile: " + e.getMessage());
        }
    }


}
