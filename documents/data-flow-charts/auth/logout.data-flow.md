```mermaid
sequenceDiagram
    participant U as User
    participant APP as React Native App
    participant AUTH as Firebase Auth
    participant OS as Device Security (PIN / Biometrics)

    U->>APP: Select logout
    APP->>AUTH: signOut
    AUTH-->>APP: Session cleared
    APP->>OS: Clear local PIN / biometric state
    APP-->>U: Logged out, show login screen
```