package com.campus.lostfound.payload.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse {
    private Boolean success;
    private String message;
    private Object data;

    // Constructor without data for backward compatibility
    public ApiResponse(Boolean success, String message) {
        this.success = success;
        this.message = message;
        this.data = null;
    }

    // Static factory methods for success responses
    public static ApiResponse success(String message) {
        return new ApiResponse(true, message, null);
    }

    public static ApiResponse success(String message, Object data) {
        return new ApiResponse(true, message, data);
    }

    public static ApiResponse success(Object data) {
        return new ApiResponse(true, "Operation successful", data);
    }

    // Static factory methods for error responses
    public static ApiResponse error(String message) {
        return new ApiResponse(false, message, null);
    }

    public static ApiResponse error(String message, Object data) {
        return new ApiResponse(false, message, data);
    }

    // Builder pattern style methods (optional)
    public ApiResponse withData(Object data) {
        this.data = data;
        return this;
    }

    public ApiResponse withMessage(String message) {
        this.message = message;
        return this;
    }

    // Convenience methods
    public boolean isSuccess() {
        return Boolean.TRUE.equals(success);
    }

    // Getter/Setter methods (Lombok @Data already generates them)
    // But we override toString for better debugging
    @Override
    public String toString() {
        return "ApiResponse{" +
                "success=" + success +
                ", message='" + message + '\'' +
                ", data=" + (data != null ? data.getClass().getSimpleName() : "null") +
                '}';
    }
}