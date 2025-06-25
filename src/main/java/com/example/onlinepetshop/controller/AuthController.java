package com.example.onlinepetshop.controller;

import com.example.onlinepetshop.dto.LoginRequest;
import com.example.onlinepetshop.dto.RegisterRequest;
import com.example.onlinepetshop.entity.enums.Role;
import com.example.onlinepetshop.entity.User;
import com.example.onlinepetshop.repository.UserRepository;
import com.example.onlinepetshop.security.JwtTokenProvider;
import com.example.onlinepetshop.service.auth.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.ACCEPTED)
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok("Вы вышли из аккаунта");
    }
}

