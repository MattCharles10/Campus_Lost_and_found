<h1 align="center">🔎 Campus Lost and Found Tracker</h1> <p align="center"> <img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License"> <img src="https://img.shields.io/badge/Spring%20Boot-3.x-brightgreen" alt="Spring Boot"> <img src="https://img.shields.io/badge/React-18.x-blue" alt="React"> <img src="https://img.shields.io/badge/MySQL-8.0-orange" alt="MySQL"> </p> <p align="center"> A centralized web-based platform that helps campus users report, search, and recover lost or found items efficiently through secure access, intelligent matching, and location-aware features. </p>

---

## 📌 Project Overview

Losing personal belongings on campus is a common issue faced by students, faculty, and staff, often leading to inconvenience and stress.  
The **Campus Lost and Found Tracker** provides a secure and organized digital solution that allows users to report, track, and match lost or found items in one centralized system.

By improving visibility and accessibility, the platform significantly increases the chances of quick item recovery and promotes a more connected campus environment.

---

## 🎯 Objectives

- Provide a centralized platform for reporting and viewing lost and found items  
- Enable quick and accurate matching between lost and found posts  
- Allow secure communication between users for item recovery  
- Ensure safety through verified campus-only access  
- Support admin moderation for reliability and authenticity  
- Analyze usage and recovery trends through dashboards and reports  

---

## 🛠️ Tech Stack

### Frontend
- **React.js** – Component-based UI for fast and interactive user experience  

### Backend
- **Spring Boot (Java)** – Secure REST APIs and backend logic  

### Database
- **MySQL** – Structured and reliable data storage  

### Tools
- **Postman** – API testing and validation  
- **Git & GitHub** – Version control  

---

## ⚙️ Core Features

- **Landing Page:** User-friendly entry point guiding login and registration  
- **Secure Authentication:** Campus-only verified access  
- **Lost & Found Posting:** Submit items with images, categories, and tags  
- **Matching Algorithm:** Keyword and location-based matching  
- **Hotspot Feature:** Identifies frequent loss locations  
- **In-App Chat:** Secure communication between users  
- **Admin Moderation:** Approval and content validation  
- **Analytics Dashboard:** Usage and recovery insights  

---

## 🔄 Application Workflow

1. **🖥️ Login / Registration** – Access via verified campus credentials  
2. **📌 Item Posting** – Submit lost or found items with details and images  
3. **🧠 Matching Engine** – System suggests potential matches and hotspots  
4. **💬 Secure Chat** – Users communicate to arrange recovery  
5. **📊 Admin Oversight** – Moderation and analytics monitoring  

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Presentation Layer"
        Web[React Web App]
        Mobile[Future Mobile Apps]
    end
    
    subgraph "Application Layer"
        Auth[Authentication Service]
        Item[Item Management Service]
        Match[Matching Service]
        Chat[Chat Service]
        Notify[Notification Service]
        Analytics[Analytics Service]
    end
    
    subgraph "Data Layer"
        DB[(MySQL Database)]
        Cache[(Redis Cache)]
        Storage[(File Storage)]
    end
    
    subgraph "External Services"
        Email[Email Service]
        SMS[SMS Gateway]
        Maps[Maps API]
    end
    
    Web --> Auth
    Auth --> DB
    
    Web --> Item
    Item --> DB
    Item --> Storage
    Item --> Match
    
    Match --> Cache
    
    Web --> Chat
    Chat --> Cache
    Chat --> DB
    
    Web --> Analytics
    Analytics --> DB
    
    Notify --> Email
    Notify --> SMS
    
    Item --> Maps
```

## 🖼️ Insights

### Landing Page
<img width="100%" alt="Landing Page Screenshot" src="https://github.com/user-attachments/assets/1aae5fb6-8546-4571-807b-2aba461e6636" />

### Login and Registration
<p float="left">
  <img width="49%" alt="Login Screenshot 1" src="https://github.com/user-attachments/assets/ab5a3ac0-1ca5-4fd4-8057-abf387f4c158" /> <img width="49%" alt="Login Screenshot 2" src="https://github.com/user-attachments/assets/ea735707-240b-4006-9a39-65c473606e89" />
</p>

### Dashboard
<img width="100%" alt="Dashboard Screenshot" src="https://github.com/user-attachments/assets/8c9a3aeb-0508-4324-afc5-3cd73b73dc46" />

### Lost and Found Item Posting
<img width="100%" alt="Lost and Found Item Posting Screenshot" src="https://github.com/user-attachments/assets/539b4893-fa2a-40d6-a4f0-16ecb9319e49" />

### Matching Algorithm
<img width="100%" alt="Matching Algorithm Screenshot" src="https://github.com/user-attachments/assets/1d045d9b-f251-4e1a-8b33-2c93e3d0dc6e" />

### In-App Chat
<img width="100%" alt="In-App Chat Screenshot" src="https://github.com/user-attachments/assets/2a52c70b-ff65-411c-bc91-dead2752ac6f" />

## 👥 Team Details

**Team 3**
- Mathew Charles  
- Dharshini Siva  
- Surtilochan Dash  
- Harini R  

**In-charge Trainer:** Ms. Pavithra Kannan

## 🚀 Future Enhancements
- **Campus Map Integration:** Visual representation of lost and found hotspots across the campus.  
- **Multi-Platform App:** Extend the platform to mobile and other devices for wider accessibility.  
- **Push Notifications:** Instant alerts when a lost or found item matches a user’s report.  
- **AI-Based Matching:** Use image recognition and intelligent algorithms for faster and more accurate matches.    
- **Enhanced Security & Privacy:** Advanced authentication and reporting features for safer user experience.
  

## 👥 Contributing
We welcome contributions! Here's how you can help
Ways to Contribute
- **Report Bugs** Create issues with detailed descriptions
- **Suggest Features**  Share your ideas for improvement
- **Submit Code**  Fix bugs or add features via PRs
### Development Process
bash
- **Fork the repository**
- **Clone your fork** git clone  https://github.com/MattCharles10/Campus_Lost_and_found.git
- **Create feature branch**   git checkout -b feature/amazing-feature
- **Make changes and commit** git commit -m "Add amazing feature"
- **Push to your fork** git push origin mathew/amazing-feature
- **Create Pull Request**
  
## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details. 

## ✅ Conclusion
The **Campus Lost and Found Tracker** provides a reliable, secure, and location-aware solution for managing lost and found items within a campus. By combining an intuitive user interface, intelligent matching, hotspot analysis, and secure communication, the platform enhances recovery efficiency and strengthens collaboration among campus users.

<p align="center"> Made with ❤️ for campus communities worldwide </p><p align="center"> <strong>⭐ Star this repository if you find it useful!</strong> </p><p align="center"> <a href="#-campus-lost-and-found-tracker">Back to Top ↑</a> </p>
