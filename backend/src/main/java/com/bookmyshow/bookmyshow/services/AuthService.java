package com.bookmyshow.bookmyshow.services;

import com.bookmyshow.bookmyshow.DTO.AuthResponse;
import com.bookmyshow.bookmyshow.DTO.LoginRequest;
import com.bookmyshow.bookmyshow.DTO.RegisterRequest;
import com.bookmyshow.bookmyshow.entities.User;
import com.bookmyshow.bookmyshow.entities.dto.Role;
import com.bookmyshow.bookmyshow.repository.UserRepository;
import com.bookmyshow.bookmyshow.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;


    public AuthResponse register(RegisterRequest request) {

        if (userRepo.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        if (userRepo.existsByPhone(request.getPhone())) {
            throw new RuntimeException("Phone already exists");
        }


        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .phone(request.getPhone())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.User)
                .build();

        userRepo.save(user);

        String token = jwtService.generateToken(new com.bookmyshow.bookmyshow.security.UserPrincipal(user));

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserDto(user))
                .build();
    }

    public AuthResponse login(LoginRequest request) {

        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepo.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(new com.bookmyshow.bookmyshow.security.UserPrincipal(user));

        return AuthResponse.builder()
                .token(token)
                .user(mapToUserDto(user))
                .build();
    }

    public com.bookmyshow.bookmyshow.DTO.UserDto mapToUserDto(User user) {
        return com.bookmyshow.bookmyshow.DTO.UserDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole() != null ? user.getRole().name().toLowerCase() : "user")
                .build();
    }

}

