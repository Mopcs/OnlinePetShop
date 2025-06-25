package com.example.onlinepetshop.service.cart;

import com.example.onlinepetshop.dto.cart.AddToCartRequest;
import com.example.onlinepetshop.dto.cart.CartResponse;

public interface CartService {
    void addToCart(String email, AddToCartRequest request);
    void removeFromCart(String email, Long productId);
    void updateQuantity(String email, AddToCartRequest request);
    void clearCart(String email);
    CartResponse getCart(String email);
}

