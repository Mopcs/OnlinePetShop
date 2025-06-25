package com.example.onlinepetshop.service.user;

import com.example.onlinepetshop.dto.order.OrderResponse;
import com.example.onlinepetshop.dto.UpdateProfileRequest;
import com.example.onlinepetshop.dto.UserResponse;
import com.example.onlinepetshop.entity.User;
import com.example.onlinepetshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserResponse getCurrentUser(Authentication auth) {
        User user = getUser(auth);
        return new UserResponse(user.getId(), user.getFullName(), user.getEmail(), user.getAddress(), user.getPhone());
    }

    @Override
    public List<OrderResponse> getUserOrders(Authentication auth) {
        User user = getUser(auth);
        return user.getOrders().stream()
                .map(order -> new OrderResponse(order.getId(), order.getStatus(), order.getOrderDate(), order.getTotal()))
                .toList();
    }

    @Override
    public void updateProfile(Authentication auth, UpdateProfileRequest request) {
        User user = getUser(auth);
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setAddress(request.getAddress());
        user.setPhone(request.getPhone());
        userRepository.save(user);
    }

    private User getUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
    }

    @Override
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));
    }
}

