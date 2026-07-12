module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: [
    '**/*.(t|j)s',
    '!**/node_modules/**',
    '!**/migrations/**',
    '!**/*.module.ts',
    '!**/main.ts',
  ],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@nestjs/core(.*)$': '<rootDir>/../node_modules/@nestjs/core$1',
    '^@nestjs/common(.*)$': '<rootDir>/../node_modules/@nestjs/common$1',
    '^@nestjs/typeorm(.*)$': '<rootDir>/../node_modules/@nestjs/typeorm$1',
    '^typeorm(.*)$': '<rootDir>/../node_modules/typeorm$1',
    '^@new-hros/libs-core$': '/home/ren0503/new-hros/api-factory/libs/libs-core/dist/index.js',
    '^@new-hros/libs-core/(.*)$': '/home/ren0503/new-hros/api-factory/libs/libs-core/dist/$1',
    '^@new-hros/libs-apis$': '/home/ren0503/new-hros/api-factory/libs/libs-apis/dist/index.js',
    '^@new-hros/libs-apis/(.*)$': '/home/ren0503/new-hros/api-factory/libs/libs-apis/dist/$1',
  },
};
