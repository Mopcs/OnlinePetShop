package com.example.onlinepetshop.controller;

import com.example.onlinepetshop.dto.order.OrderResponse;
import com.example.onlinepetshop.dto.UpdateProfileRequest;
import com.example.onlinepetshop.dto.UserResponse;
import com.example.onlinepetshop.service.user.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<UserResponse> getCurrentUser(Authentication authentication) {
        return ResponseEntity.ok(userService.getCurrentUser(authentication));
    }

    @GetMapping("/orders")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<List<OrderResponse>> getUserOrders(Authentication authentication) {
        return ResponseEntity.ok(userService.getUserOrders(authentication));
    }

    @PutMapping("/me")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<?> updateProfile(@RequestBody UpdateProfileRequest request, Authentication authentication) {
        userService.updateProfile(authentication, request);
        return ResponseEntity.ok().build();
    }
}

