const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
	connection.end();
});

beforeEach(() => {
	return seed(data);
});

describe("/api/categories", () => {
	test("GET - status 200 - Responds with an object containing an array of all categories", () => {
		return request(app)
			.get("/api/categories")
			.expect(200)
			.then((res) => {
				expect(res.body.categories.length).toBe(4);
				res.body.categories.forEach((category) => {
					expect(typeof category.slug).toBe("string");
					expect(typeof category.description).toBe("string");
				});
			});
	});
	test("GET - status 404 - Responds with an error message when an invalid path has been used", () => {
		return request(app)
			.get("/api/cattegories")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid URL");
			});
	});
});

describe("/api", () => {
	test("GET - status 200 - Responds with an object containing information on all server endpoints", () => {
		return request(app)
			.get("/api")
			.expect(200)
			.then((res) => {
				expect(typeof res.body).toBe("object");
				const endpointObject = res.body.endpoints;
				const endpointKeys = Object.keys(endpointObject);
				expect(endpointKeys.length >= 2).toBe(true);
				expect(endpointObject.hasOwnProperty("GET /api")).toBe(true);
				expect(endpointObject.hasOwnProperty("GET /api/categories")).toBe(true);
			});
	});
});
