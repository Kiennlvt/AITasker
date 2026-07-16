package com.aitasker.scheduler;

import com.aitasker.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EscrowScheduler {

    private static final long FIFTEEN_MINUTES_MS = 15 * 60 * 1000L;
    private static final long ONE_HOUR_MS = 60 * 60 * 1000L;

    private final ProjectService projectService;

    @Scheduled(fixedRate = FIFTEEN_MINUTES_MS)
    public void processExpiredCancellationRequests() {
        projectService.processExpiredCancellationRequests();
    }

    @Scheduled(fixedRate = ONE_HOUR_MS)
    public void processAutoReleaseMilestones() {
        projectService.processAutoReleaseMilestones();
    }
}
