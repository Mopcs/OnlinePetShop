package com.example.onlinepetshop.controller;

import com.example.onlinepetshop.dto.cart.AddToCartRequest;
import com.example.onlinepetshop.dto.cart.CartResponse;
import com.example.onlinepetshop.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public CartResponse getCart(Authentication auth) {
        return cartService.getCart(auth.getName());
    }

    @PostMapping("/add")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> addToCart(@RequestBody AddToCartRequest request, Authentication auth) {
        cartService.addToCart(auth.getName(), request);
        return ResponseEntity.ok().build();
    }

    @PutMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> updateQuantity(@RequestBody AddToCartRequest request, Authentication auth) {
        cartService.updateQuantity(auth.getName(), request);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{productId}")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> removeFromCart(@PathVariable Long productId, Authentication auth) {
        cartService.removeFromCart(auth.getName(), productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    public ResponseEntity<Void> clearCart(Authentication auth) {
        cartService.clearCart(auth.getName());
        return ResponseEntity.ok().build();
    }
}

