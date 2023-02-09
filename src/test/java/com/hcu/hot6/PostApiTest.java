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

    /**
     * Project, Study, Mentoring 각각, 정상 create 케이스 테스트
     * */
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
        request.setMaxMember(5);

        String url = "http://localhost:"+port+"/posts";

        ResponseEntity<PostCreationResponse> response = restTemplate.postForEntity(url, request, PostCreationResponse.class);

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        Assertions.assertThat(response.getBody()).isNotNull();

        Assertions.assertThat(response.getBody().getDtype().compareTo("S") == 0);
        Assertions.assertThat(response.getBody().getTitle().compareTo("제목 test") == 0);
    }


    /**
     * Project, Study, Mentoring 각각, 모집 인원 음수인 경우 BAD_REQUEST 에러 나는지 테스트
     * 각 필드에 필요한 max 모집 인원 하나라도 음수를 입력하면 BAD_REQUEST 에러가 난다.
     * 하지만 실수로 필요한 max 모집 인원 필드를 채우지 않고 보냈을 때에는 엔티티의 @NotNull 어노테이션이 0으로 채워주기 때문에 정상 작동하는데에 문제가 없다.
     * */
    @DisplayName("max 모집 인원 수가 음수 이므로, bad request 에러가 나야 합니다.")
    @Test
    public void 모집인원_음수_study() throws Exception{
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
        request.setMaxMember(-1);

        String url = "http://localhost:"+port+"/posts";

        ResponseEntity<PostCreationResponse> response = restTemplate.postForEntity(url, request, PostCreationResponse.class);

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @DisplayName("max 모집 인원 수가 음수 이므로, bad request 에러가 나야 합니다.")
    @Test
    public void 모집인원_음수_project() throws Exception{
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
        request.setMaxDeveloper(-3);
        request.setMaxPlanner(2);
        request.setMaxDesigner(1);

        String url = "http://localhost:"+port+"/posts";

        ResponseEntity<PostCreationResponse> response = restTemplate.postForEntity(url, request, PostCreationResponse.class);

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @DisplayName("max 모집 인원 수가 음수 이므로, bad request 에러가 나야 합니다.")
    @Test
    public void 모집인원_음수_mentoring() throws Exception{
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
        request.setMaxMentor(-1);
        request.setMaxMentee(4);

        String url = "http://localhost:"+port+"/posts";

        ResponseEntity<PostCreationResponse> response = restTemplate.postForEntity(url, request, PostCreationResponse.class);

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    /**
     * Validation 체크. RequestBody가 정상적으로 들어왔는지 다음과 같은 기준으로 확인한다. (PostCreationRequest에서 사용한 Validation 어노테이션이 잘 작동하는지 확인.)
     *
     * 1. 필수로 입력해야 하는 사항에 대해 입력하지 않은 경우 BAD_REQUEST 에러가 나야 한다.
     * 2. 날짜 입력 @Future
     * 3. 모집 인원 @PositiveOrZero
     * 4. 날짜 포맷팅
     * 5. hasPay
     * */
    @DisplayName("PostCreationRequest @NotNull validation 체크 - BAD_REQUEST 에러가 나야 한다.")
    @Test
    public void notnull_validation() throws Exception{
        // dtype, title, contact, authorId, postEnd, projectEnd, projectStart 각각 주석 처리 해가면서 체크하기
        // String, String으로 포맷팅 되는 LocalDateTime은 validation 체크 가능하지만, hasPay는 Boolean 타입이라 여기서 validation 체크 불가능함
        PostCreationRequest request = new PostCreationRequest();
        request.setDtype("S");
        //request.setDtype("P");
        //request.setDtype("M");
        request.setTitle("제목 test");
        request.setContent("내용 test");
        //request.setContact("연락처 test");
        request.setPostEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0));
        request.setProjectStart(LocalDateTime.of(2023, 3, 10, 0, 0, 0));
        request.setProjectEnd(LocalDateTime.of(2023, 7, 2, 0, 0, 0));
        request.setAuthorId(1L);
        request.setHasPay(true);
//        멘토링인 경우 아래 코드 활성화
//        request.setMaxMember(5);
//        프로젝트인 경우 아래 코드 활성화
//        request.setMaxDeveloper(3);
//        request.setMaxPlanner(2);
//        request.setMaxDesigner(1);
//        멘토링인 경우 아래 코드 활성화
//        request.setMaxMentor(1);
//        request.setMaxMentee(4);

        String url = "http://localhost:"+port+"/posts";

        ResponseEntity<PostCreationResponse> response = restTemplate.postForEntity(url, request, PostCreationResponse.class);

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }

    @DisplayName("날짜 입력 중 과거 날짜가 하나라도 들어온 상황에는 BAD_REQUEST 상태가 반환되어야 한다.")
    @Test
    public void 날짜입력_Future(){
        PostCreationRequest request = new PostCreationRequest();
        request.setDtype("P");
        request.setTitle("제목 test");
        request.setContent("내용 test");
        request.setContact("연락처 test");
        request.setPostEnd(LocalDateTime.of(2023, 3, 2, 0, 0, 0));
        request.setProjectStart(LocalDateTime.of(2023, 3, 10, 0, 0, 0));
        request.setProjectEnd(LocalDateTime.of(2022, 7, 2, 0, 0, 0));
        request.setAuthorId(1L);
        request.setHasPay(true);
        request.setMaxDeveloper(3);
        request.setMaxPlanner(2);
        request.setMaxDesigner(1);

        String url = "http://localhost:"+port+"/posts";

        ResponseEntity<PostCreationResponse> response = restTemplate.postForEntity(url, request, PostCreationResponse.class);

        Assertions.assertThat(response.getStatusCode()).isEqualTo(HttpStatus.BAD_REQUEST);
    }



}
