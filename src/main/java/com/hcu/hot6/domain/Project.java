package com.hcu.hot6.domain;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter @Setter
@DiscriminatorValue("P")
public class Project extends Post{

    private int maxDeveloper;
    private int maxPlanner;
    private int maxDesigner;

    private int currDeveloper;
    private int currPlanner;
    private int currDesigner;

    private boolean hasPay;

    //=== 생성 메서드 ===//
//    public static Project createProject(String title, String content, String contact, LocalDateTime postEnd, LocalDateTime projectStart, LocalDateTime projectEnd, Member author, int maxDeveloper, int maxPlanner, int maxDesigner) {
//        Project project = new Project();
//
//        // String 기본 정보 지정
//        project.setTitle(title);
//        project.setContent(content);
//        project.setContact(contact);
//
//        // LocalDateTime 지정
//        project.getPeriod().setPostStart(LocalDateTime.now());
//        project.getPeriod().setPostEnd(postEnd);
//        project.getPeriod().setProjectStart(projectStart);
//        project.getPeriod().setProjectEnd(projectEnd);
//
//        // Total 계산 및 지정
//        project.setTotal(maxDeveloper + maxPlanner + maxDesigner);
//
//        // initial value : isCompleted = false
//        project.setCompleted(false);
//
//        // Author 양방향 매핑
//        project.registerAuthor(author);
//
//        // Project 멤버 변수 지정
//        project.setMaxDeveloper(maxDeveloper);
//        project.setMaxPlanner(maxPlanner);
//        project.setMaxDesigner(maxDesigner);
//        project.setCurrDeveloper(0);
//        project.setCurrPlanner(0);
//        project.setCurrDesigner(0);
//
//        return project;
//    }

}
