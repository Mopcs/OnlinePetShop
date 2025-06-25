package com.example.onlinepetshop.service.user;

import com.example.onlinepetshop.dto.order.OrderResponse;
import com.example.onlinepetshop.dto.UpdateProfileRequest;
import com.example.onlinepetshop.dto.UserResponse;
import com.example.onlinepetshop.entity.User;
import org.springframework.security.core.Authentication;

import java.util.List;

public interface UserService {
    UserResponse getCurrentUser(Authentication auth);
    List<OrderResponse> getUserOrders(Authentication auth);
    void updateProfile(Authentication auth, UpdateProfileRequest request);
    User findByEmail(String email);
}
