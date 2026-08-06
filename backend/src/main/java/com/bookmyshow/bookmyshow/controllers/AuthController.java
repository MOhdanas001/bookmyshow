package com.bookmyshow.bookmyshow.controllers;


import com.bookmyshow.bookmyshow.DTO.*;
import com.bookmyshow.bookmyshow.services.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request) {
       AuthResponse response = authService.register(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(ApiResponse.<AuthResponse>builder()
                        .success(true)
                        .message("Registration succesfully")
                        .data(response)
                        .build());
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request) {

        AuthResponse response =authService.login(request);

        return ResponseEntity.ok(ApiResponse.<AuthResponse>builder()
                .success(true)
                .message("Login Succesfully")
                .data(response)
                .build()
        );
    }

    @org.springframework.web.bind.annotation.GetMapping("/me")
    public ResponseEntity<ApiResponse<UserDto>> getCurrentUser(
            @org.springframework.security.core.annotation.AuthenticationPrincipal com.bookmyshow.bookmyshow.security.UserPrincipal principal) {

        if (principal == null || principal.getUser() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.<UserDto>builder()
                            .success(false)
                            .message("Not authenticated")
                            .data(null)
                            .build());
        }

        UserDto userDto = authService.mapToUserDto(principal.getUser());
        return ResponseEntity.ok(ApiResponse.<UserDto>builder()
                .success(true)
                .message("Current user fetched successfully")
                .data(userDto)
                .build());
    }
}
