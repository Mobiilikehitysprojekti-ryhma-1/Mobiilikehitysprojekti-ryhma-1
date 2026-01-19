# Caregiver Support App

A mobile application designed to support home care and informal caregiving. The app enables task management, safety monitoring based on location, health measurements and user specific settings in a simple and reliable way.

## Features

- Task assignment
- Location-based safety borders with alerts
- Health measurements and analysis with AI image recognizition
- Push notifications
- Local user preferences (light/dark mode)

## Technology Stack

- React Native
- Expo
- React Native Paper
- Firebase (Authentication, Firestore, Storage, Cloud Functions, FCM)
- Azure AI (image analysis)
- Zod
- Jest

## Architecture

The application implements a feature based architecture. Core responsibilities such as authentication, task management, location/safety monitoring and measurements are separated into independent feature modules. <br>
Firebase is used as the backend platform while device level capabilities, such as location, biometrics, local storage, are handled locally on the client.

## User Roles

- **Admin**: Manages tasks, safety settings and monitors alerts  
- **User**: Completes assigned tasks, records measurements and is monitored for safety  

## Authentication

User identity and sessions are handled by Firebase Authentication. PIN code and biometric authentication are implemented as local device-level security mechanisms on top of an existing authenticated session.

## Data Flow and Diagrams

Key application data flows are documented using Mermaid sequence diagrams.

See `/Documents/flows` for detailed diagrams.

## Project Structure

The project is organized by features with shared UI components and utilities separated from business logic and data access layers.

## Documentation

Additional architecture notes and flow documentation can be found in the `/Documents` directory.
