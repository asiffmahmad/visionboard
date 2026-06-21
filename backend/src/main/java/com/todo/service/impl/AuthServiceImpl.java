package com.todo.service.impl;

import com.todo.dto.AuthResponse;
import com.todo.dto.LoginRequest;
import com.todo.dto.RegisterRequest;
import com.todo.dto.RegisterRequest;
import com.todo.dto.TokenRefreshRequest;
import com.todo.dto.GoogleLoginRequest;
import com.todo.entity.RefreshToken;
import com.todo.entity.User;
import com.todo.enums.Role;
import com.todo.exception.BadRequestException;
import com.todo.exception.UnauthorizedException;
import com.todo.repository.RefreshTokenRepository;
import com.todo.repository.UserRepository;
import com.todo.security.JwtTokenProvider;
import com.todo.service.AuthService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import java.time.Instant;
import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final long refreshExpirationMs;
    private final String googleClientId;

    public AuthServiceImpl(
            AuthenticationManager authenticationManager,
            UserRepository userRepository,
            RefreshTokenRepository refreshTokenRepository,
            PasswordEncoder passwordEncoder,
            JwtTokenProvider tokenProvider,
            @Value("${todo.jwt.refresh-expiration-ms}") long refreshExpirationMs,
            @Value("${todo.google.client-id}") String googleClientId) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
        this.refreshExpirationMs = refreshExpirationMs;
        this.googleClientId = googleClientId;
    }

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new BadRequestException("Username is already taken");
        }
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("Email is already in use");
        }

        User user = new User();
        user.setUsername(request.username());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));
        user.setRole(Role.USER);
        user.setEnabled(true);

        User savedUser = userRepository.save(user);

        // Generate tokens
        String accessToken = tokenProvider.generateTokenFromUserId(savedUser.getId());
        RefreshToken refreshToken = createRefreshToken(savedUser);

        return new AuthResponse(accessToken, refreshToken.getToken());
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BadRequestException("User not found"));

        user.setLastSeen(java.time.LocalDateTime.now());
        userRepository.save(user);

        String accessToken = tokenProvider.generateToken(authentication);
        RefreshToken refreshToken = createRefreshToken(user);

        return new AuthResponse(accessToken, refreshToken.getToken());
    }

    @Override
    @Transactional
    public AuthResponse googleLogin(GoogleLoginRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId))
                .build();

            GoogleIdToken idToken = verifier.verify(request.credential());
            if (idToken == null) {
                throw new UnauthorizedException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = idToken.getPayload();
            String email = payload.getEmail();
            String name = (String) payload.get("name");

            Optional<User> existingUserOpt = userRepository.findByEmail(email);
            User user;

            if (existingUserOpt.isPresent()) {
                user = existingUserOpt.get();
                user.setLastSeen(java.time.LocalDateTime.now());
                user = userRepository.save(user);
            } else {
                user = new User();
                user.setUsername(name.replaceAll("\\s+", "").toLowerCase() + UUID.randomUUID().toString().substring(0, 4));
                user.setEmail(email);
                user.setPassword(passwordEncoder.encode(UUID.randomUUID().toString())); // Random secure password
                user.setRole(Role.USER);
                user.setEnabled(true);
                user.setLastSeen(java.time.LocalDateTime.now());
                user = userRepository.save(user);
            }

            // Create Authentication object to generate JWT
            UsernamePasswordAuthenticationToken authentication = 
                new UsernamePasswordAuthenticationToken(user, null, Collections.emptyList());
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String accessToken = tokenProvider.generateTokenFromUserId(user.getId());
            RefreshToken refreshToken = createRefreshToken(user);

            return new AuthResponse(accessToken, refreshToken.getToken());

        } catch (Exception e) {
            throw new UnauthorizedException("Google login failed: " + e.getMessage());
        }
    }

    @Override
    @Transactional
    public AuthResponse refresh(TokenRefreshRequest request) {
        String requestRefreshToken = request.refreshToken();

        return refreshTokenRepository.findByToken(requestRefreshToken)
                .map(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String accessToken = tokenProvider.generateTokenFromUserId(user.getId());
                    // Rotate refresh token
                    refreshTokenRepository.deleteByUser(user);
                    RefreshToken newRefreshToken = createRefreshToken(user);
                    return new AuthResponse(accessToken, newRefreshToken.getToken());
                })
                .orElseThrow(() -> new UnauthorizedException("Refresh token is not in database"));
    }

    @Override
    @Transactional
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue)
                .ifPresent(refreshTokenRepository::delete);
    }

    private RefreshToken createRefreshToken(User user) {
        // Delete existing token if any
        refreshTokenRepository.deleteByUser(user);
        refreshTokenRepository.flush();

        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshExpirationMs));
        refreshToken.setToken(UUID.randomUUID().toString());

        return refreshTokenRepository.save(refreshToken);
    }

    private RefreshToken verifyExpiration(RefreshToken token) {
        if (token.getExpiryDate().isBefore(Instant.now())) {
            refreshTokenRepository.delete(token);
            throw new UnauthorizedException("Refresh token was expired. Please sign in again");
        }
        return token;
    }
}
