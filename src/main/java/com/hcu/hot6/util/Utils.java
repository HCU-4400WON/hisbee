package com.hcu.hot6.util;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;

public class Utils {
    public static LocalDateTime toLocalDateTime(Date e) {
        if (e == null) return null;

        return LocalDateTime.ofInstant(e.toInstant(), ZoneId.systemDefault());
    }

    public static Date toDate(LocalDateTime e) {
        if (e == null) return null;

        return java.sql.Timestamp.valueOf(e);
    }

    public static List<String> toArray(String s, String delim) {
        if (s == null || s.equals("?")) {
            return List.of();
        }
        return List.of(s.split(delim));
    }

    public static String toString(List<String> list, String delim) {
        return (list == null || list.isEmpty()) ? null : String.join(delim, list);
    }

    public static <T> T nonNullOrElse(T obj, T defaultObj) {
        return (obj != null) ? obj : defaultObj;
    }
}