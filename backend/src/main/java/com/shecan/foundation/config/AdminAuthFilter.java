package com.shecan.foundation.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.shecan.foundation.dto.ApiResponse;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AdminAuthFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(AdminAuthFilter.class);
    private static final String HEADER = "X-Admin-Key";

    private final String secretKey;
    private final ObjectMapper mapper;

    public AdminAuthFilter(
            @Value("${app.admin.secret-key:shecan-admin-2025}") String secretKey,
            ObjectMapper mapper) {
        this.secretKey = secretKey;
        this.mapper    = mapper;
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        return !request.getRequestURI().startsWith("/api/admin");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {

        String key = request.getHeader(HEADER);
        String ip  = request.getRemoteAddr();

        if (key == null || key.isBlank()) {
            log.warn("Admin access attempt from {} — missing {} header", ip, HEADER);
            sendUnauthorized(response, "Missing X-Admin-Key header");
            return;
        }

        if (!secretKey.equals(key)) {
            log.warn("Admin access attempt from {} — invalid key provided", ip);
            sendUnauthorized(response, "Invalid admin key");
            return;
        }

        log.info("Admin access granted from {} — {}", ip, request.getRequestURI());
        chain.doFilter(request, response);
    }

    private void sendUnauthorized(HttpServletResponse response, String msg) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        ApiResponse<Void> body = ApiResponse.error(msg);
        response.getWriter().write(mapper.writeValueAsString(body));
    }
}
