package com.hcu.hot6.domain.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostCreationResponse {

    private Long id;
    private String title;
    private String dtype;
}
