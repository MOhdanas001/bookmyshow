package com.bookmyshow.bookmyshow.common;


public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}