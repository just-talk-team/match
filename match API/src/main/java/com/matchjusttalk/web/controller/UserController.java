package com.matchjusttalk.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/just-talk")
public class UserController {
    @GetMapping("/home")
    public String home() {
        return "JustTalk Match 🍻";
    }
}
