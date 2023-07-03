package com.hcu.hot6.batch;

import java.util.HashMap;
import lombok.RequiredArgsConstructor;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.springframework.boot.ApplicationArguments;
import org.springframework.stereotype.Component;

@RequiredArgsConstructor
@Component
public class ApiJobRunner extends JobRunner {

    private final Scheduler scheduler;

    @Override
    protected void doRun(ApplicationArguments args) {
        JobDetail jobDetail = buildJobDetail(ApiSchJob.class, "apiJob", "batch", new HashMap());
        Trigger trigger = buildJobTrigger("0/10 * * * * ?"); // 10초마다 실행

        try {
            scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
    }
}
