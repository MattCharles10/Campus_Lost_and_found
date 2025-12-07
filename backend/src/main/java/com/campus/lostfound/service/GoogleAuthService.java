package com.campus.lostfound.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class GoogleAuthService {

    private static final String GOOGLE_CLIENT_ID = "your-google-client-id.apps.googleusercontent.com";

    public GoogleUserInfo verifyGoogleToken(String idTokenString) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(GOOGLE_CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();

                GoogleUserInfo userInfo = new GoogleUserInfo();
                userInfo.setSub(payload.getSubject());
                userInfo.setEmail(payload.getEmail());
                userInfo.setEmailVerified(Boolean.valueOf(payload.getEmailVerified()));
                userInfo.setGivenName((String) payload.get("given_name"));
                userInfo.setFamilyName((String) payload.get("family_name"));
                userInfo.setPicture((String) payload.get("picture"));

                return userInfo;
            } else {
                throw new RuntimeException("Invalid Google ID token.");
            }
        } catch (Exception e) {
            throw new RuntimeException("Google token verification failed: " + e.getMessage());
        }
    }

    public static class GoogleUserInfo {
        private String sub;
        private String email;
        private Boolean emailVerified;
        private String givenName;
        private String familyName;
        private String picture;

        public String getSub() { return sub; }
        public void setSub(String sub) { this.sub = sub; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public Boolean getEmailVerified() { return emailVerified; }
        public void setEmailVerified(Boolean emailVerified) { this.emailVerified = emailVerified; }

        public String getGivenName() { return givenName; }
        public void setGivenName(String givenName) { this.givenName = givenName; }

        public String getFamilyName() { return familyName; }
        public void setFamilyName(String familyName) { this.familyName = familyName; }

        public String getPicture() { return picture; }
        public void setPicture(String picture) { this.picture = picture; }
    }
}