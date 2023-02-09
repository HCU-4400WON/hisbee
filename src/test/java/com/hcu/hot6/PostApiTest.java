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
@Transactional
public class PostApiTest {

    @LocalServerPort
    private int port;

    @Autowired
    private TestRestTemplate restTemplate;

    @DisplayName("멘토링 생성 API 테스트 : Normal")
    @Test
    public void createMentoring() throws Exception{
        // 1L를 PK로 가지는 유저가 있는 상태에서 테스트. -> 통과
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

        Assertions.assertThat(response.getBody().getDtype().compareTo("M") == 0);
        Assertions.assertThat(response.getBody().getTitle().compareTo("제목 test") == 0);
    }

    @DisplayName("프로젝트 생성 API 테스트 : Normal")
    @Test
    public void createProject() throws Exception{
        // 1L를 PK로 가지는 유저가 있는 상태에서 테스트. -> 통과
        PostCreationRequest request = new PostCreationRequest();
        request.setDtype("P");
        request.setTitle("제목 test");
        request.setContent("내용 test");
        request.setContact("연락처 test");
        request.setPostEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0));
        request.setProjectStart(LocalDateTime.of(2023, 3, 10, 0, 0, 0));
        request.setProjectEnd(LocalDateTime.of(2023, 7, 2, 0, 0, 0));
        request.setAuthorId(1L);
        request.setHasPay(true);
        request.setMaxDeveloper(3);
        request.setMaxPlanner(2);
        request.setMaxDesigner(1);

        String url = "http://localhost:"+port+"/posts";

        ResponseEntity<PostCreationResponse> response = restTemplate.postForEntity(url, request, PostCreationResponse.class);

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isNotNull();

        Assertions.assertThat(response.getBody().getDtype().compareTo("P") == 0);
        Assertions.assertThat(response.getBody().getTitle().compareTo("제목 test") == 0);
    }

    @DisplayName("스터디 생성 API 테스트 : Normal")
    @Test
    public void createStudy() throws Exception{
        // 1L를 PK로 가지는 유저가 있는 상태에서 테스트. -> 통과
        PostCreationRequest request = new PostCreationRequest();
        request.setDtype("S");
        request.setTitle("제목 test");
        request.setContent("내용 test");
        request.setContact("연락처 test");
        request.setPostEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0));
        request.setProjectStart(LocalDateTime.of(2023, 3, 10, 0, 0, 0));
        request.setProjectEnd(LocalDateTime.of(2023, 7, 2, 0, 0, 0));
        request.setAuthorId(1L);
        request.setMaxDeveloper(3);
        request.setMaxMember(5);

        String url = "http://localhost:"+port+"/posts";

        ResponseEntity<PostCreationResponse> response = restTemplate.postForEntity(url, request, PostCreationResponse.class);

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isNotNull();

        Assertions.assertThat(response.getBody().getDtype().compareTo("S") == 0);
        Assertions.assertThat(response.getBody().getTitle().compareTo("제목 test") == 0);
    }

    @DisplayName("스터디 생성 API 테스트 : Abnormal -> 필수 입력사항이 생략된 bad request")
    @Test
    public void 스터디_필수_생략() throws Exception{
        // 1L를 PK로 가지는 유저가 있는 상태에서 테스트. -> 통과
        PostCreationRequest request = new PostCreationRequest();
        request.setDtype("S");
        request.setTitle("제목 test");
        request.setContent("내용 test");
        request.setContact("연락처 test");
        request.setPostEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0));
        request.setProjectStart(LocalDateTime.of(2023, 3, 10, 0, 0, 0));
        request.setProjectEnd(LocalDateTime.of(2023, 7, 2, 0, 0, 0));
        request.setAuthorId(1L);
        request.setMaxDeveloper(3);
        request.setMaxMember(4);

        String url = "http://localhost:"+port+"/posts";

        ResponseEntity<PostCreationResponse> response = restTemplate.postForEntity(url, request, PostCreationResponse.class);

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
    }

}
