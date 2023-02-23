package com.hcu.hot6.domain.response;

import com.hcu.hot6.domain.Mentoring;
import com.hcu.hot6.domain.Post;
import com.hcu.hot6.domain.Project;
import com.hcu.hot6.domain.Study;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class PostReadOneResponse {

    private String dtype;
    private Long id;
    private String title;
    private String content;
    private String contact;
    private Date postStart;
    private Date postEnd;
    private Date projectStart;
    private Date projectEnd;
    private String writer;

    private int maxDeveloper;
    private int maxPlanner;
    private int maxDesigner;
    private int currDeveloper;
    private int currPlanner;
    private int currDesigner;

    private int maxMember;
    private int currMember;

    private int maxMentor;
    private int maxMentee;
    private int currMentor;
    private int currMentee;
    private boolean hasPay;
    private boolean isVerified;

    public PostReadOneResponse(Post post) {
        this.dtype = post.getDtype();
        this.id = post.getId();
        this.title = post.getTitle();
        this.content = post.getContent();
        this.contact = post.getContact();
        this.writer = post.getAuthor().getNickname();
        this.postStart = java.sql.Timestamp.valueOf(post.getPeriod().getPostStart());
        this.postEnd = java.sql.Timestamp.valueOf(post.getPeriod().getPostEnd());
        this.projectStart = java.sql.Timestamp.valueOf(post.getPeriod().getProjectStart());
        this.projectEnd = java.sql.Timestamp.valueOf(post.getPeriod().getProjectEnd());

        switch (dtype) {
            case "P" -> {
                Project project = (Project) post;

                this.maxDesigner = project.getMaxDesigner();
                this.maxDeveloper = project.getMaxDeveloper();
                this.maxPlanner = project.getMaxPlanner();

                this.currDesigner = project.getCurrDesigner();
                this.currDeveloper = project.getCurrDeveloper();
                this.currPlanner = project.getCurrPlanner();

                this.hasPay = project.isHasPay();
            }
            case "S" -> {
                Study study = (Study) post;

                this.maxMember = study.getMaxMember();
                this.currMember = study.getCurrMember();
            }
            case "M" -> {
                Mentoring mentoring = (Mentoring) post;

                this.maxMentor = mentoring.getMaxMentor();
                this.maxMentee = mentoring.getCurrMentee();

                this.currMentor = mentoring.getCurrMentor();
                this.currMentee = mentoring.getCurrMentee();

                this.hasPay = mentoring.isHasPay();
            }
        }
    }

    public void verify(String email, Post post) {
        this.isVerified = email.equals(post.getAuthor().getEmail());
    }

    //Todo: isCompleted를 반환할 것인지 상의 -> 반환 한다면 tag 형식으로 표시하면 좋을 것 같음.
}
