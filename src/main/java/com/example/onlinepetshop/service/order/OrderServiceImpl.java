package com.example.onlinepetshop.service.order;

import com.example.onlinepetshop.dto.order.CreateOrderRequest;
import com.example.onlinepetshop.dto.order.OrderItemResponse;
import com.example.onlinepetshop.dto.order.OrderResponse;
import com.example.onlinepetshop.entity.*;
import com.example.onlinepetshop.entity.enums.OrderStatus;
import com.example.onlinepetshop.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements OrderService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    @Override
    public OrderResponse placeOrder(String userEmail, CreateOrderRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.CREATED);
        order.setPhone(request.getPhone());
        order.setAddress(request.getAddress());
        order.setComment(request.getComment());

        List<OrderItem> orderItemList = request.getItems().stream()
                .map(dto -> {
                    Product product = productRepository.findById(dto.getProductId())
                            .orElseThrow(() -> new NoSuchElementException("Товар не найден"));

                    OrderItem item = new OrderItem();
                    item.setProduct(product);
                    item.setQuantity(dto.getQuantity());
                    item.setPrice(product.getPrice());
                    item.setOrder(order);
                    return item;
                })
                .toList();

        BigDecimal totalAmount = orderItemList.stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        order.setItems(orderItemList);
        order.setTotal(totalAmount);

        Order savedOrder = orderRepository.save(order);
        orderItemRepository.saveAll(orderItemList);

        return new OrderResponse(
                savedOrder.getId(),
                savedOrder.getStatus(),
                savedOrder.getOrderDate(),
                totalAmount,
                savedOrder.getItems().stream()
                        .map(item -> new OrderItemResponse(
                                item.getProduct().getId(),
                                item.getProduct().getName(),
                                item.getQuantity(),
                                item.getPrice()
                        ))
                        .toList(),
                savedOrder.getPhone(),
                savedOrder.getAddress(),
                savedOrder.getComment()
        );
    }

    @Override
    public OrderResponse getOrderById(Long id, Authentication auth) {
        if (!userRepository.findByEmail(auth.getName()).isPresent()) {
            throw new AccessDeniedException("Доступ запрещён");
        }

        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Заказ не найден"));

        if (!order.getUser().getEmail().equals(auth.getName())) {
            throw new AccessDeniedException("Доступ к чужому заказу запрещён");
        }

        BigDecimal totalAmount = order.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getOrderDate(),
                totalAmount,
                items,
                order.getUser().getEmail(),
                order.getPhone(),
                order.getAddress(),
                order.getComment()
        );
    }

    @Override
    public List<OrderResponse> getUserOrders(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Пользователь не найден"));

        List<Order> orders = orderRepository.findByUser(user);

        return orders.stream()
                .map(order -> {
                    BigDecimal total = order.getItems().stream()
                            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    return new OrderResponse(
                            order.getId(),
                            order.getStatus(),
                            order.getOrderDate(),
                            total,
                            order.getItems().stream()
                                    .map(item -> new OrderItemResponse(
                                            item.getProduct().getId(),
                                            item.getProduct().getName(),
                                            item.getQuantity(),
                                            item.getPrice()
                                    ))
                                    .toList(),
                            order.getPhone(),
                            order.getAddress(),
                            order.getComment()
                    );
                })
                .toList();
    }

    @Override
    public void updateOrderStatus(Long id, OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Заказ не найден"));
        order.setStatus(status);
        orderRepository.save(order);
    }

    @Override
    public List<OrderResponse> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(order -> {
                    BigDecimal total = order.getItems().stream()
                            .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    List<OrderItemResponse> items = order.getItems().stream()
                            .map(item -> new OrderItemResponse(
                                    item.getProduct().getId(),
                                    item.getProduct().getName(),
                                    item.getQuantity(),
                                    item.getPrice()
                            ))
                            .toList();

                    return new OrderResponse(
                            order.getId(),
                            order.getStatus(),
                            order.getOrderDate(),
                            total,
                            items,
                            order.getUser().getEmail(),
                            order.getPhone(),
                            order.getAddress(),
                            order.getComment()
                    );
                })
                .toList();
    }

    @Override
    public OrderResponse getOrderForAdmin(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Заказ не найден"));

        BigDecimal totalAmount = order.getItems().stream()
                .map(item -> item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        List<OrderItemResponse> items = order.getItems().stream()
                .map(item -> new OrderItemResponse(
                        item.getProduct().getId(),
                        item.getProduct().getName(),
                        item.getQuantity(),
                        item.getPrice()
                ))
                .toList();

        return new OrderResponse(
                order.getId(),
                order.getStatus(),
                order.getOrderDate(),
                totalAmount,
                items,
                order.getUser().getEmail(),
                order.getPhone(),
                order.getAddress(),
                order.getComment()
        );
    }

    @Override
    public void delete(Long id) {
        if (!orderRepository.existsById(id)) {
            throw new IllegalArgumentException("Заказ не найден");
        }
        orderRepository.deleteById(id);
    }
}
