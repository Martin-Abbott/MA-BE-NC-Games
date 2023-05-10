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
				expect(endpointKeys.length >= 3).toBe(true);
				expect(endpointObject.hasOwnProperty("GET /api")).toBe(true);
				expect(endpointObject.hasOwnProperty("GET /api/categories")).toBe(true);
				expect(
					endpointObject.hasOwnProperty("GET /api/reviews/:review_id")
				).toBe(true);
			});
	});
});

describe("/api/reviews/:review_id", () => {
	test("GET - status 200 - Responds with an object containing the information for a review with the given review_id", () => {
		return request(app)
			.get("/api/reviews/1")
			.expect(200)
			.then((res) => {
				expect(typeof res.body).toBe("object");
				expect(res.body.review.length).toBe(1);
				expect(res.body.review[0].review_id).toBe(1);
				expect(typeof res.body.review[0].title).toBe("string");
				expect(typeof res.body.review[0].category).toBe("string");
				expect(typeof res.body.review[0].designer).toBe("string");
				expect(typeof res.body.review[0].owner).toBe("string");
				expect(typeof res.body.review[0].review_body).toBe("string");
				expect(typeof res.body.review[0].review_img_url).toBe("string");
				expect(typeof res.body.review[0].created_at).toBe("string");
				expect(typeof res.body.review[0].votes).toBe("number");
			});
	});
	test("GET - status 400 - Responds with an invalid review_id error message when passed an invalid review_id", () => {
		return request(app)
			.get("/api/reviews/one")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid review_id");
			});
	});
	test("GET - status 404 - Responds with an error message when passed a review_id which returns no results", () => {
		return request(app)
			.get("/api/reviews/1000")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("Review_id not found");
			});
	});
});
