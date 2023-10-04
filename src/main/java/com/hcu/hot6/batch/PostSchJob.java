package com.hcu.hot6.batch;

import lombok.RequiredArgsConstructor;
import lombok.SneakyThrows;
import org.quartz.Job;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.scheduling.quartz.QuartzJobBean;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class PostSchJob extends QuartzJobBean {

    private final Job postJob;
    private final JobLauncher jobLauncher;
    private final JobExplorer jobExplorer;

    /**
     * 배치를 실행시키는 구문 : 스케줄링된 이벤트가 발생할때마다 한번씩 호출된다.
     *
     * @param context
     * @throws JobExecutionException
     */
    @SneakyThrows
    @Override
    protected void executeInternal(JobExecutionContext context) throws JobExecutionException {}
}
