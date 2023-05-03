package com.hcu.hot6.servlet;

import com.hcu.hot6.domain.VisitCount;
import com.hcu.hot6.service.VisitCountService;
import jakarta.servlet.annotation.WebListener;
import jakarta.servlet.http.HttpSession;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@WebListener
@RequiredArgsConstructor
public class SessionListener implements HttpSessionListener {

    private static final Map<String, HttpSession> sessions = new ConcurrentHashMap<>();
    private VisitCountService visitCountService;
    private Logger logger = LoggerFactory.getLogger(this.getClass());
    static private int activeSessions = 0;


    public static int getActiveSessions() {
        return activeSessions;
    }

    @Override
    public void sessionCreated(HttpSessionEvent se) {
        activeSessions++;

        System.out.println("SessionCnt:" + activeSessions + " Session ID ".concat(se.getSession().getId()).concat(" created at ").concat(LocalDateTime.now().toString()));
        logger.debug("SessionCnt:" + activeSessions + " Session ID ".concat(se.getSession().getId()).concat(" created at ").concat(LocalDateTime.now().toString()));

        sessions.put(se.getSession().getId(), se.getSession());
        HttpSession session = se.getSession();

        VisitCount visitCount = new VisitCount(session.getId(), session.getLastAccessedTime(), session.getCreationTime(), session.isNew());
        ApplicationContext context = WebApplicationContextUtils.getWebApplicationContext(session.getServletContext());
        visitCountService = (VisitCountService) context.getBean("visitCountService");
        visitCountService.saveSessionInfo(visitCount);
    }

    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        activeSessions--;
        logger.debug("SessionCnt:" + activeSessions + " Session ID ".concat(se.getSession().getId()).concat(" destroyed at ").concat(LocalDateTime.now().toString()));

        if(sessions.get(se.getSession().getId()) != null){
            sessions.get(se.getSession().getId()).invalidate();
            sessions.remove(se.getSession().getId());
        }
    }
}
