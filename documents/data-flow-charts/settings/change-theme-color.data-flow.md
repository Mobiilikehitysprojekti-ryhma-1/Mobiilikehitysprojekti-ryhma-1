```mermaid
sequenceDiagram
    participant U as User
    participant APP as React Native App
    participant THEME as Theme Provider

    U->>APP: Toggle light/dark mode
    APP->>THEME: Update theme
    THEME-->>APP: Theme applied
    APP-->>U: UI updated
```