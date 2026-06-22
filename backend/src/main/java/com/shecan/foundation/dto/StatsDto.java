package com.shecan.foundation.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StatsDto {
    private long total;
    private long newCount;
    private long reviewedCount;
    private long contactedCount;
}
