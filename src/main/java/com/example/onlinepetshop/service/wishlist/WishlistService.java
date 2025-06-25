package com.example.onlinepetshop.service.wishlist;

import com.example.onlinepetshop.entity.Product;
import com.example.onlinepetshop.entity.Wishlist;

import java.util.List;

public interface WishlistService {
    List<Product> getProductsInWishlist();
    void addProduct(Long productId);
    void removeProduct(Long productId);
    void clear();
    boolean isProductInWishlist(Long productId);
}
