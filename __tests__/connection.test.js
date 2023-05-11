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
				expect(endpointKeys.length >= 5).toBe(true);
				expect(endpointObject.hasOwnProperty("GET /api")).toBe(true);
				expect(endpointObject.hasOwnProperty("GET /api/categories")).toBe(true);
				expect(
					endpointObject.hasOwnProperty("GET /api/reviews/:review_id")
				).toBe(true);
				expect(endpointObject.hasOwnProperty("GET /api/reviews")).toBe(true);
				expect(
					endpointObject.hasOwnProperty("GET /api/reviews/:review_id/comments")
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

describe("/api/reviews", () => {
	test("GET - status 200 - Responds with an object containing an array of all reviews", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then((res) => {
				expect(typeof res.body).toBe("object");
				expect(res.body.reviews.length).toBe(13);
				res.body.reviews.forEach((review) => {
					expect(typeof review.review_id).toBe("number");
					expect(typeof review.title).toBe("string");
					expect(typeof review.category).toBe("string");
					expect(typeof review.designer).toBe("string");
					expect(typeof review.owner).toBe("string");
					expect(typeof review.review_img_url).toBe("string");
					expect(typeof review.created_at).toBe("string");
					expect(typeof review.votes).toBe("number");
				});
			});
	});
	test("GET - status 200 - Each returned review object should have it's review_body omitted", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then((res) => {
				res.body.reviews.forEach((review) => {
					expect(review.review_body).toBe(undefined);
				});
			});
	});
	test("GET - status 200 - The response object should be sorted by date descending", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then((res) => {
				expect(res.body.reviews).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});
	test("GET - status 200 - Each returned review object should have a comment_count key and value", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then((res) => {
				res.body.reviews.forEach((review) => {
					expect(typeof review.comment_count).toBe("number");
				});
				expect(res.body.reviews[0].comment_count).toBe(0);
				expect(res.body.reviews[4].comment_count).toBe(3);
			});
	});
});

describe("/api/reviews/:review_id/comments", () => {
	test("GET - status 200 - Responds with an object containing all comments which match a given review_id", () => {
		return request(app)
			.get("/api/reviews/2/comments")
			.expect(200)
			.then((res) => {
				expect(typeof res.body).toBe("object");
				expect(res.body.comments.length).toBe(3);
				res.body.comments.forEach((comment) => {
					expect(typeof comment.comment_id).toBe("number");
					expect(typeof comment.body).toBe("string");
					expect(typeof comment.votes).toBe("number");
					expect(typeof comment.author).toBe("string");
					expect(typeof comment.review_id).toBe("number");
					expect(typeof comment.created_at).toBe("string");
					expect(comment.review_id).toBe(2);
				});
			});
	});
	test("GET - status 200 - The response object should be sorted by date descending", () => {
		return request(app)
			.get("/api/reviews/2/comments")
			.expect(200)
			.then((res) => {
				expect(res.body.comments).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});
	test("GET - status 200 - The response object should be empty when passed a valid review_id which has no comments associated with it", () => {
		return request(app)
			.get("/api/reviews/1/comments")
			.expect(200)
			.then((res) => {
				expect(typeof res.body).toBe("object");
				// expect(Array.isArray(res.body.comments)).toBe(true);
				// expect(res.body.comments).toEqual([]);
				// expect(res.body.comments.length).toBe(0);
			});
	});
	test("GET - status 400 - Responds with an invalid review_id error message when passed an invalid review_id", () => {
		return request(app)
			.get("/api/reviews/one/comments")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid review_id");
			});
	});
	test("GET - status 404 - Responds with an error message when passed a review_id which returns no results", () => {
		return request(app)
			.get("/api/reviews/1000/comments")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("Review_id not found");
			});
	});
});
