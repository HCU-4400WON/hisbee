package com.hcu.hot6;

import com.hcu.hot6.domain.request.PostCreationRequest;
import com.hcu.hot6.domain.response.PostCreationResponse;
import org.assertj.core.api.Assertions;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.annotation.Rollback;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ExtendWith(SpringExtension.class)
@Rollback
@Transactional
public class PostApiTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @DisplayName("모집글 생성 API 테스트")
    @Test
    public void createMentoring() throws Exception{


        PostCreationRequest request = new PostCreationRequest();
        request.setDtype("M");
        request.setTitle("제목 test");
        request.setContent("내용 test");
        request.setContact("연락처 test");
        request.setPostEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0));
        request.setProjectStart(LocalDateTime.of(2023, 3, 10, 0, 0, 0));
        request.setProjectEnd(LocalDateTime.of(2023, 7, 2, 0, 0, 0));
        request.setAuthorId(1L);
        request.setHasPay(true);
        request.setMaxMentor(0);
        request.setMaxMentee(4);

        String url = "http://localhost:"+port+"/posts";

        ResponseEntity<PostCreationResponse> response = restTemplate.postForEntity(url, request, PostCreationResponse.class);

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isNotNull();

        Assertions.assertThat(response.getBody().getDtype().compareTo("M"));
        Assertions.assertThat(response.getBody().getTitle().compareTo("제목 test"));
    }

}
