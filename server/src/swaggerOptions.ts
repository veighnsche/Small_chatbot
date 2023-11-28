const options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Llama tree API",
			version: "1.0.0",
			description: "This is a REST API application made with Express. It retrieves data from Firestore and OpenAI.",
			license: {
				name: "MIT",
				url: "https://spdx.org/licenses/MIT.html",
			},
			servers: [
				{
					url: "http://localhost:3001/api/v1",
				},
			],
		},
	},
	// Path to the API docs
	apis: ["./src/api/*.ts"], // adjust the path according to your file structure
};

export default options;