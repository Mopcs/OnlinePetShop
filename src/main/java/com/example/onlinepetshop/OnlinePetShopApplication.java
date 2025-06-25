package com.example.onlinepetshop;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

@SpringBootApplication(scanBasePackages = "com.example.onlinepetshop")
@EnableJpaRepositories
@EnableWebSocket
public class OnlinePetShopApplication {

    public static void main(String[] args) {
        SpringApplication.run(OnlinePetShopApplication.class, args);
    }

}
