package com.todo.service.impl;

import com.todo.dto.UserDto;
import com.todo.dto.UserProfileUpdateRequest;
import com.todo.entity.User;
import com.todo.exception.BadRequestException;
import com.todo.exception.ResourceNotFoundException;
import com.todo.mapper.UserMapper;
import com.todo.repository.UserRepository;
import com.todo.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Value;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.todo.dto.GoogleLoginRequest;
import com.todo.exception.UnauthorizedException;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final String googleClientId;
    private final String googleClientSecret;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, 
                           @Value("${todo.google.client-id}") String googleClientId,
                           @Value("${todo.google.client-secret}") String googleClientSecret) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.googleClientId = googleClientId;
        this.googleClientSecret = googleClientSecret;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return userMapper.toDto(user);
    }

    @Override
    @Transactional
    public UserDto updateProfile(Long userId, UserProfileUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check duplicate email
        if (!user.getEmail().equalsIgnoreCase(request.email())) {
            userRepository.findByEmail(request.email()).ifPresent(u -> {
                throw new BadRequestException("Email is already in use");
            });
            user.setEmail(request.email());
        }

        // Check duplicate username
        if (!user.getUsername().equalsIgnoreCase(request.username())) {
            userRepository.findByUsername(request.username()).ifPresent(u -> {
                throw new BadRequestException("Username is already taken");
            });
            user.setUsername(request.username());
        }

        // Optional password update
        if (request.password() != null && !request.password().trim().isEmpty()) {
            if (request.password().length() < 6) {
                throw new BadRequestException("Password must be at least 6 characters long");
            }
            user.setPassword(passwordEncoder.encode(request.password()));
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toDto(updatedUser);
    }

    @Override
    @Transactional
    public UserDto syncWithGoogle(Long userId, GoogleLoginRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        try {
            String googleId = null;
            String picture = null;

            if (request.authCode() != null && !request.authCode().isEmpty()) {
                GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                        new NetHttpTransport(), new GsonFactory(),
                        "https://oauth2.googleapis.com/token",
                        googleClientId,
                        googleClientSecret,
                        request.authCode(),
                        "postmessage")  // "postmessage" is typically the redirect_uri for popup flow
                        .execute();

                String idTokenString = tokenResponse.getIdToken();
                if (idTokenString == null) {
                    throw new UnauthorizedException("Failed to obtain ID token");
                }
                GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                        .setAudience(Collections.singletonList(googleClientId))
                        .build();

                GoogleIdToken idToken = verifier.verify(idTokenString);
                if (idToken != null) {
                    GoogleIdToken.Payload payload = idToken.getPayload();
                    googleId = payload.getSubject();
                    picture = (String) payload.get("picture");
                    
                    user.setGoogleAccessToken(tokenResponse.getAccessToken());
                    if (tokenResponse.getRefreshToken() != null) {
                        user.setGoogleRefreshToken(tokenResponse.getRefreshToken());
                    }
                }
            } else if (request.credential() != null && !request.credential().isEmpty()) {
                GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                        .setAudience(Collections.singletonList(googleClientId))
                        .build();

                GoogleIdToken idToken = verifier.verify(request.credential());
                if (idToken == null) {
                    throw new UnauthorizedException("Invalid Google ID token");
                }
                GoogleIdToken.Payload payload = idToken.getPayload();
                googleId = payload.getSubject();
                picture = (String) payload.get("picture");
            } else if (request.accessToken() != null && !request.accessToken().isEmpty()) {
                RestTemplate restTemplate = new RestTemplate();
                HttpHeaders headers = new HttpHeaders();
                headers.setBearerAuth(request.accessToken());
                HttpEntity<String> entity = new HttpEntity<>(headers);
                ResponseEntity<Map> response = restTemplate.exchange("https://www.googleapis.com/oauth2/v3/userinfo", HttpMethod.GET, entity, Map.class);
                Map<String, Object> payload = response.getBody();
                if (payload == null) {
                    throw new UnauthorizedException("Failed to fetch Google profile");
                }
                googleId = (String) payload.get("sub");
                picture = (String) payload.get("picture");
            } else {
                throw new BadRequestException("Must provide credential, accessToken, or authCode");
            }

            user.setGoogleId(googleId);
            if (picture != null) {
                user.setAvatarUrl(picture);
            }
            user.setGoogleSynced(true);

            User updatedUser = userRepository.save(user);
            return userMapper.toDto(updatedUser);
        } catch (Exception e) {
            throw new BadRequestException("Google sync failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<com.todo.dto.UserActivityDto> getAllUsersWithActivities() {
        return userRepository.findAllUsersWithActivityCounts();
    }

    @Override
    @Transactional
    public com.todo.dto.UserActivityDto updateUserRole(Long userId, com.todo.enums.Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Prevent assigning SUPER_ADMIN from the API
        if (newRole == com.todo.enums.Role.SUPER_ADMIN) {
            throw new BadRequestException("SUPER_ADMIN role can only be assigned via database.");
        }

        // Prevent revoking SUPER_ADMIN from the API
        if (user.getRole() == com.todo.enums.Role.SUPER_ADMIN) {
            throw new BadRequestException("Cannot revoke SUPER_ADMIN role via application.");
        }

        user.setRole(newRole);
        userRepository.save(user);
        
        return userRepository.findAllUsersWithActivityCounts()
                .stream()
                .filter(dto -> dto.getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Failed to fetch updated user"));
    }
}
