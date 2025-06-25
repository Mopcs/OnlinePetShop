package com.example.onlinepetshop.controller;

import com.example.onlinepetshop.dto.wishlist.CheckWishlistResponse;
import com.example.onlinepetshop.entity.Product;
import com.example.onlinepetshop.service.wishlist.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/wishlist")
@RequiredArgsConstructor
public class WishlistController {

    private final WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<Product>> getWishlist() {
        List<Product> products = wishlistService.getProductsInWishlist();
        return ResponseEntity.ok(products);
    }

    @PostMapping("/add/{productId}")
    public ResponseEntity<Void> addToWishlist(@PathVariable Long productId) {
        wishlistService.addProduct(productId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/remove/{productId}")
    public ResponseEntity<Void> removeFromWishlist(@PathVariable Long productId) {
        wishlistService.removeProduct(productId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<CheckWishlistResponse> check(@PathVariable Long productId) {
        boolean exists = wishlistService.isProductInWishlist(productId);
        return ResponseEntity.ok(new CheckWishlistResponse(exists));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<Void> clearWishlist() {
        wishlistService.clear();
        return ResponseEntity.ok().build();
    }
}
