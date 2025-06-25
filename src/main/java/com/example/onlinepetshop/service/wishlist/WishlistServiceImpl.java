package com.example.onlinepetshop.service.wishlist;

import com.example.onlinepetshop.entity.Product;
import com.example.onlinepetshop.entity.User;
import com.example.onlinepetshop.entity.Wishlist;
import com.example.onlinepetshop.entity.WishlistItem;
import com.example.onlinepetshop.repository.ProductRepository;
import com.example.onlinepetshop.repository.WishlistRepository;
import com.example.onlinepetshop.service.user.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class WishlistServiceImpl implements WishlistService {

    private final WishlistRepository wishlistRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    private Wishlist getOrCreateWishlistForCurrentUser() {
        String currentUserEmail = getCurrentUserEmail();
        User user = userService.findByEmail(currentUserEmail);

        return wishlistRepository.findByUser(user).orElseGet(() -> createNewWishlistForUser(user));
    }

    @Override
    public boolean isProductInWishlist(Long productId) {
        Wishlist wishlist = getOrCreateWishlistForCurrentUser();
        return wishlist.getItems().stream()
                .anyMatch(item -> item.getProduct().getId().equals(productId));
    }

    private Wishlist createNewWishlistForUser(User user) {
        Wishlist wishlist = new Wishlist();
        wishlist.setUser(user);
        return wishlistRepository.save(wishlist);
    }

    private String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("Пользователь не авторизован");
        }
        return authentication.getName();
    }

    @Override
    public List<Product> getProductsInWishlist() {
        Wishlist wishlist = getOrCreateWishlistForCurrentUser();
        return wishlist.getItems().stream()
                .map(WishlistItem::getProduct)
                .toList();
    }

    @Override
    public void addProduct(Long productId) {
        Wishlist wishlist = getOrCreateWishlistForCurrentUser();
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("Товар не найден"));

        boolean alreadyExists = wishlist.getItems().stream()
                .anyMatch(item -> item.getProduct().getId().equals(productId));

        if (!alreadyExists) {
            WishlistItem newItem = new WishlistItem();
            newItem.setProduct(product);
            newItem.setWishlist(wishlist);
            wishlist.getItems().add(newItem);
            wishlistRepository.save(wishlist);
        }
    }

    @Override
    public void removeProduct(Long productId) {
        Wishlist wishlist = getOrCreateWishlistForCurrentUser();

        boolean removed = wishlist.getItems().removeIf(item -> item.getProduct().getId().equals(productId));
        if (removed) {
            wishlistRepository.save(wishlist);
        }
    }

    @Override
    public void clear() {
        Wishlist wishlist = getOrCreateWishlistForCurrentUser();
        wishlist.getItems().clear();
        wishlistRepository.save(wishlist);
    }
}