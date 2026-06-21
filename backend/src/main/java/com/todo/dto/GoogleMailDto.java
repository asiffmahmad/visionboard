package com.todo.dto;

public record GoogleMailDto(
    String id,
    String snippet,
    String subject,
    String sender,
    String date
) {}
