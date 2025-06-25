package com.example.onlinepetshop.dto;

import lombok.Data;

@Data
public class UpdateProfileRequest {
    private String fullName;
    private String address;
    private String phone;
    private String email;
}
