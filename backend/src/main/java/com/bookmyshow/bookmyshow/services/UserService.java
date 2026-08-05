package com.bookmyshow.bookmyshow.services;

import com.bookmyshow.bookmyshow.DTO.UserResponse;

import java.util.List;

public interface UserService {
    List<UserResponse> getAllUsers();
    UserResponse getUserById(Long id);
    void deleteUser(Long id);
}
