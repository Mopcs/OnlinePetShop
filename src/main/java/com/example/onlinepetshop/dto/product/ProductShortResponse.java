package com.example.onlinepetshop.dto.product;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductShortResponse {
    private Long id;
    private String name;
    private BigDecimal price;
    private int quantity;
}

