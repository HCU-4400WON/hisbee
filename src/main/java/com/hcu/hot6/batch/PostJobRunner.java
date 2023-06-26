package com.hcu.hot6.batch;

import lombok.RequiredArgsConstructor;
import org.quartz.JobDetail;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.springframework.boot.ApplicationArguments;
import org.springframework.stereotype.Component;

import java.util.HashMap;


@RequiredArgsConstructor
@Component
public class PostJobRunner extends JobRunner{

    private final Scheduler scheduler;
    @Override
    protected void doRun(ApplicationArguments args) {
        String[] sourceArgs = args.getSourceArgs();

        JobDetail jobDetail = buildJobDetail(PostSchJob.class, "postJob", "batch", new HashMap());
        Trigger trigger = buildJobTrigger("0/30 * * * * ?"); // 30초마다 실행
        jobDetail.getJobDataMap().put("requestDate", sourceArgs[0]);

        try{
            scheduler.scheduleJob(jobDetail, trigger);
        } catch (SchedulerException e) {
            e.printStackTrace();
        }
    }
}
