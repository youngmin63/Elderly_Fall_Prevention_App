# JudeBalance

JudeBalance is a mobile application designed to help prevent falls in older adults by
measuring balance using smartphone sensors and providing personalised exercise recommendations.

The app guides users through a short balance test, analyses stability, and recommends
appropriate exercises based on individual balance performance.

---

## Demo
*(Screenshots or demo video to be added)*

---

## Key Features

- Balance measurement using smartphone sensors (20-second fixed measurement)
- Stability-based balance score calculation
- Left and right foot balance distinction
- Personalised exercise recommendations based on balance scores
- Simple and accessible UI designed for older adults

---

## Tech Stack

### Frontend
- React Native (Expo)

### AI / Recommendation Server
- Python
- FastAPI
- Rule-based + model-based exercise recommendation logic

### Backend
- Java
- Spring Boot

### Others
- RESTful API
- JSON-based data communication

---

## Architecture

The system is designed with a clear separation of responsibilities to improve scalability
and maintainability.



**Data Flow Overview**
1. The mobile app collects balance data using device sensors.
2. Balance scores and user profile data are sent to the AI recommendation server.
3. The recommendation server processes the data and returns personalised exercise suggestions.
4. Measurement results and recommendations are stored via the backend server.

---

## My Contribution

- Implemented balance measurement, result display, and exercise recommendation UI using React Native
- Designed and developed the exercise recommendation API using FastAPI
- Implemented rule-based and model-based recommendation logic
- Integrated frontend with the AI recommendation server
- Collaborated with a backend developer to define API specifications, data structures, and response formats
- Participated in end-to-end testing across frontend, AI server, and backend components

---

## Challenges & Solutions

### Challenge 1: Converting raw sensor data into a meaningful balance score
**Solution:**  
Adopted a fixed 20-second measurement approach followed by a stability-based score conversion,
ensuring consistent and comparable balance results.

### Challenge 2: Managing complex recommendation logic without overloading the frontend
**Solution:**  
Separated the exercise recommendation logic into a dedicated FastAPI server, keeping the frontend
lightweight and improving modularity.

### Challenge 3: Supporting personalised recommendations based on individual balance differences
**Solution:**  
Incorporated left and right foot balance scores into the recommendation logic to reflect
individual stability characteristics.

---

## Results

- Completed an end-to-end balance measurement and exercise recommendation flow
- Improved system modularity by separating AI logic into a standalone server
- Enabled personalised exercise recommendations tailored to individual balance performance
- Achieved smooth collaboration through clearly defined API contracts

---

## What I Learned

- Designing and implementing APIs in a multi-server architecture
- Translating sensor data into user-facing features
- Collaborating effectively across frontend, AI, and backend roles
- Structuring a project for maintainability and future expansion

---





