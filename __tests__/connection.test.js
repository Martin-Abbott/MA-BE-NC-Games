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
});
