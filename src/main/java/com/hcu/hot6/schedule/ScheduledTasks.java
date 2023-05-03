package com.hcu.hot6.schedule;

import com.hcu.hot6.domain.enums.OrderBy;
import com.hcu.hot6.domain.filter.PostSearchFilter;
import com.hcu.hot6.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class ScheduledTasks {

    private final PostRepository postRepository;

    @Scheduled(cron = "0 0 0 * * *")
    public void midnightPostClose() {
        LocalDate now = LocalDate.now();
        PostSearchFilter filter = PostSearchFilter.builder()
                .isClosed(false)
                .orderBy(OrderBy.END)
                .build();

        postRepository.findAll(filter, null)
                .stream()
                .filter(post -> post.getThumbnail()
                        .getRecruitEnd()
                        .toLocalDate()
                        .isBefore(now))
                .forEach(post -> post.getThumbnail().close());
    }
}
