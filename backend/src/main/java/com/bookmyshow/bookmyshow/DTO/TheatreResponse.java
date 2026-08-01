package com.bookmyshow.bookmyshow.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TheatreResponse {

    private Long id;

    private String name;

    private String city;

    private String address;

    private Integer totalSeats;
}