package com.campus.lostfound.service;

import com.campus.lostfound.config.JwtUtils;
import com.campus.lostfound.config.UserPrincipal;
import com.campus.lostfound.dto.*;
import com.campus.lostfound.model.User;
import com.campus.lostfound.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private GoogleAuthService googleAuthService;

    public AuthResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findByEmail(userPrincipal.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getStudentId(),
                user.getPhoneNumber(),
                user.getAvatarUrl()
        );

        return new AuthResponse(jwt, "Bearer", userResponse);
    }

    public AuthResponse registerUser(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new RuntimeException("Email is already taken!");
        }

        User user = new User();
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setStudentId(registerRequest.getStudentId());
        user.setEmailVerified(true);

        User savedUser = userRepository.save(user);

        // Auto login after registration
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(registerRequest.getEmail());
        loginRequest.setPassword(registerRequest.getPassword());

        return authenticateUser(loginRequest);
    }

    public AuthResponse authenticateWithGoogle(String accessToken) {
        GoogleAuthService.GoogleUserInfo googleUserInfo = googleAuthService.verifyGoogleToken(accessToken);

        Optional<User> userOptional = userRepository.findByEmail(googleUserInfo.getEmail());
        User user;

        if (userOptional.isPresent()) {
            user = userOptional.get();
        } else {
            // Register new user
            user = new User();
            user.setFirstName(googleUserInfo.getGivenName());
            user.setLastName(googleUserInfo.getFamilyName());
            user.setEmail(googleUserInfo.getEmail());
            user.setPassword(passwordEncoder.encode("google-auth-" + System.currentTimeMillis()));
            user.setProvider(User.AuthProvider.GOOGLE);
            user.setProviderId(googleUserInfo.getSub());
            user.setEmailVerified(true);
            user.setAvatarUrl(googleUserInfo.getPicture());
            user = userRepository.save(user);
        }

        // Update last login
        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        // Generate JWT token
        UserPrincipal userPrincipal = UserPrincipal.create(user);
        String jwt = jwtUtils.generateJwtToken(
                new UsernamePasswordAuthenticationToken(userPrincipal, null, userPrincipal.getAuthorities())
        );

        UserResponse userResponse = new UserResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getStudentId(),
                user.getPhoneNumber(),
                user.getAvatarUrl()
        );

        return new AuthResponse(jwt, "Bearer", userResponse);
    }
}