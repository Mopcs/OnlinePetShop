package com.example.onlinepetshop.service.cart;

import com.example.onlinepetshop.dto.cart.AddToCartRequest;
import com.example.onlinepetshop.dto.cart.CartItemResponse;
import com.example.onlinepetshop.dto.cart.CartResponse;
import com.example.onlinepetshop.entity.Cart;
import com.example.onlinepetshop.entity.CartItem;
import com.example.onlinepetshop.entity.Product;
import com.example.onlinepetshop.entity.User;
import com.example.onlinepetshop.repository.CartItemRepository;
import com.example.onlinepetshop.repository.CartRepository;
import com.example.onlinepetshop.repository.ProductRepository;
import com.example.onlinepetshop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    @Override
    public void addToCart(String email, AddToCartRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        Cart cart = cartRepository.findByUser(user)
                .orElseGet(() -> cartRepository.save(new Cart(null, user, new ArrayList<>())));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new NoSuchElementException("Продукт не найден"));

        CartItem item = cartItemRepository.findByCartAndProduct(cart, product)
                .orElse(new CartItem(null, cart, product, 0));

        item.setQuantity(item.getQuantity() + request.getQuantity());
        cart.getItems().add(item);
        cartRepository.save(cart);
    }

    @Override
    public void removeFromCart(String email, Long productId) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Cart cart = cartRepository.findByUser(user).orElseThrow();
        Product product = productRepository.findById(productId).orElseThrow();
        CartItem item = cartItemRepository.findByCartAndProduct(cart, product).orElseThrow();

        cart.getItems().remove(item);
        cartItemRepository.delete(item);
        cartRepository.save(cart);
    }

    @Override
    public void updateQuantity(String email, AddToCartRequest request) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Cart cart = cartRepository.findByUser(user).orElseThrow();
        Product product = productRepository.findById(request.getProductId()).orElseThrow();
        CartItem item = cartItemRepository.findByCartAndProduct(cart, product).orElseThrow();

        item.setQuantity(request.getQuantity());
        cartItemRepository.save(item);
    }

    @Override
    public void clearCart(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Cart cart = cartRepository.findByUser(user).orElseThrow();
        cartItemRepository.deleteAll(cart.getItems());
        cart.getItems().clear();
        cartRepository.save(cart);
    }

    @Override
    public CartResponse getCart(String email) {
        User user = userRepository.findByEmail(email).orElseThrow();
        Cart cart = cartRepository.findByUser(user).orElseGet(() -> {
            Cart newCart = new Cart(null, user, new ArrayList<>());
            return cartRepository.save(newCart);
        });

        List<CartItemResponse> items = cart.getItems().stream().map(item ->
                new CartItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getProduct().getImageUrl(),
                        item.getQuantity(),
                        item.getProduct().getPrice()
                )
        ).toList();

        BigDecimal total = items.stream()
                .map(i -> i.getPricePerUnit().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartResponse(items, total);
    }
}

