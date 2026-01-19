# Architecture
## Repository structure
```
/   
    src/
        app/
            App.tsx
            navigation/
        features/
            auth/
                screens/
                state/
                data/
                domain/
                tests/
            tasks/
            measurements/
            safety/
        shared/
            hooks/
            types/
    Documents/
        Architecture.md
        flows/
```
## Folders
### Top level folders
`app` contains the application shell and configuration, such as the root component and navigation setup.

`features` contains the application's feature modules. Each feature groups its related screens, state management, and data logic.

`shared` contains reusable UI components, theming, and common utilities shared across features.

### Lower level folders
`feature` folders capture all logic and data of a single feature.<br>
Example structure might be:
```
feature/
    screens/
    state/
    data/
    domain/
    tests/
```

Not all the folders above are necesessary.<br>
Feature folders expand with needs.

### Tech stack
- ´React-Native (Expo)´ for application
- ´TypeScript´
- ´React-Native-Paper´
- ´React Navigation´
- ´Zod´ for DTOs and validation
- ´Jest + jest-expo´ for tests
- ´Expo Secure Store´
- ´Expo Local Authentication´
- ´Firebase´

## Setup (Windows / Command Prompt)

### 1. Install dependencies
npm install

### 2. Start development server
npx expo start

### Tests
npm test