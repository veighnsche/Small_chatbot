module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	// clearMocks: true,
	verbose: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	coverageReporters: ["text", "lcov", "clover"],
	// testPathIgnorePatterns: [
	//   "/node_modules/",
	//   "/dist/",
	//   // Any other paths to ignore
	// ],
	// moduleNameMapper: {
	//   // If you have custom paths in your tsconfig.json, map them here
	//   // "^@components/(.*)$": "<rootDir>/src/components/$1"
	// },
	// globalSetup: './path/to/globalSetup.js',  // If you have global setup script
	// globalTeardown: './path/to/globalTeardown.js', // If you have global teardown script
	// watchPlugins: [
	//   // If there are any Jest watch plugins you want to use
	//   // "jest-watch-typeahead/filename",
	//   // "jest-watch-typeahead/testname"
	// ],
	// Other configurations...
};
