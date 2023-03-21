package com.hcu.hot6.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;

public class Utils {
    public static LocalDateTime toLocalDateTime(Date e) {
        return LocalDateTime.ofInstant(e.toInstant(), ZoneId.systemDefault());
    }

    public static Date toDate(LocalDateTime e) {
        return java.sql.Timestamp.valueOf(e);
    }
}
