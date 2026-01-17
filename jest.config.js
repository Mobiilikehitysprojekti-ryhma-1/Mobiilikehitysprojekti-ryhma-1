module.exports = {
    preset: "jest-expo",
    testEnvironment: "node",

    // Reset mocks automatically between tests
    clearMocks: true,

    // Coverage
    collectCoverage: true,
    coverageProvider: "v8",
    coverageDirectory: "coverage",

    // Test file patterns
    testMatch: [
        "**/__tests__/**/*.(ts|tsx)",
        "**/?(*.)+(spec|test).(ts|tsx)",
    ],

    // Ignore folders that should not be tested
    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/",
        "/build/",
    ],
};