export default {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src"],
    testMatch: [
        "**/__tests__/**/*.+(ts|tsx|js)",
        "**/?(*.)+(spec|test).+(ts|tsx|js)"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: {
                    types: ["jest", "jsdom"]
                }
            }
        ]
    },
    setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
    moduleNameMapper: {
        "^@src/(.*)$": "<rootDir>/src/$1"
    },
    extensionsToTreatAsEsm: [".ts"],
    collectCoverageFrom: [
        "src/**/*.{ts,tsx}",
        "!src/**/*.d.ts",
        "!src/**/*.test.{ts,tsx}",
        "!src/**/*.spec.{ts,tsx}"
    ]
};
