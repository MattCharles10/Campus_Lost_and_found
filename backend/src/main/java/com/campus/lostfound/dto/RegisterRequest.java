package com.campus.lostfound.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {

    @NotBlank(message = "First name is required")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @NotBlank(message = "Last name is required")
    @Size(min = 2, max = 50, message = "Last name must be between 2 and 50 characters")
    private String lastName;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Size(max = 100, message = "Email must be less than 100 characters")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, max = 40, message = "Password must be between 6 and 40 characters")
    private String password;

    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;  // Add this field!

    @Size(max = 20, message = "Student ID must be less than 20 characters")
    private String studentId;

    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    @Size(max = 20, message = "Phone number must be less than 20 characters")
    private String phoneNumber;

    // Custom validation method to check if passwords match
    @AssertTrue(message = "Passwords must match")
    public boolean isPasswordMatching() {
        if (password == null || confirmPassword == null) {
            return false;
        }
        return password.equals(confirmPassword);
    }
}