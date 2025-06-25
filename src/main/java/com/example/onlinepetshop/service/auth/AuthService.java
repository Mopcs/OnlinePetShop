package com.example.onlinepetshop.service.auth;

import com.example.onlinepetshop.dto.LoginRequest;
import com.example.onlinepetshop.dto.RegisterRequest;
import org.springframework.http.ResponseEntity;

public interface AuthService {

    ResponseEntity<?> register(RegisterRequest request);

    ResponseEntity<?> login(LoginRequest request);
}

