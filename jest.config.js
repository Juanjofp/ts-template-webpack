module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jest-environment-node',
    coverageDirectory: './coverage/',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.ts', '!src/index.ts'],
    coverageThreshold: {
        global: {
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80
        }
    },
    watchPlugins: [
        'jest-watch-typeahead/filename',
        'jest-watch-typeahead/testname'
    ],
    setupFilesAfterEnv: ['./test/setup-test.ts'],
    moduleNameMapper: {
        'src/(.*)': '<rootDir>/src/$1',
        '@/(.*)': '<rootDir>/src/$1'
    }
};
