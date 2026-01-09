# Architecture
## Repository structure
```
/
    src/
        app/
            App.tsx
            navigation/
        features/
        shared/
    documents/
        Architecture.md
        flows/
```

### Top level folders
`app` contains the application shell and configuration, such as the root component and navigation setup.

`features` contains the application's feature modules. Each feature groups its related screens, state management, and data logic.

`shared` contains reusable UI components, theming, and common utilities shared across features.