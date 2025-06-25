package com.example.onlinepetshop.dto.order;

import com.example.onlinepetshop.dto.cart.CartItemDto;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateOrderRequest {
    private List<CartItemDto> items;
    private String phone;
    private String address;
    private String comment;
}
