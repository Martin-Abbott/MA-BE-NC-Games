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
				expect(endpointKeys.length).toBe(8);
				expect(endpointObject.hasOwnProperty("GET /api")).toBe(true);
				expect(endpointObject.hasOwnProperty("GET /api/categories")).toBe(true);
				expect(
					endpointObject.hasOwnProperty("GET /api/reviews/:review_id")
				).toBe(true);
				expect(endpointObject.hasOwnProperty("GET /api/reviews")).toBe(true);
				expect(
					endpointObject.hasOwnProperty("GET /api/reviews/:review_id/comments")
				).toBe(true);
				expect(
					endpointObject.hasOwnProperty("POST /api/reviews/:review_id/comments")
				).toBe(true);
				expect(
					endpointObject.hasOwnProperty("PATCH /api/reviews/:review_id")
				).toBe(true);
				expect(
					endpointObject.hasOwnProperty("DELETE /api/comments/:comment_id")
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
	test("GET - status 400 - Responds with an invalid request error message when passed an invalid review_id", () => {
		return request(app)
			.get("/api/reviews/one")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid request");
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
	test("PATCH - status 200 - Responds with an updated review object when passed a valid review_id and a valid inc_votes object which increments the votes count", () => {
		const incVotesObj = { inc_votes: 10 };
		return request(app)
			.patch("/api/reviews/1")
			.send(incVotesObj)
			.expect(200)
			.then((res) => {
				expect(typeof res.body).toBe("object");
				const review = res.body.review;
				expect(review.length).toBe(1);
				expect(typeof review[0].review_id).toBe("number");
				expect(typeof review[0].title).toBe("string");
				expect(typeof review[0].category).toBe("string");
				expect(typeof review[0].designer).toBe("string");
				expect(typeof review[0].owner).toBe("string");
				expect(typeof review[0].review_img_url).toBe("string");
				expect(typeof review[0].created_at).toBe("string");
				expect(typeof review[0].votes).toBe("number");
				expect(review[0].votes).toBe(11);
			});
	});
	test("PATCH - status 200 - Responds with an updated review object when passed a valid review_id and a valid inc_votes object which decrements the votes count", () => {
		const incVotesObj = { inc_votes: -11 };
		return request(app)
			.patch("/api/reviews/1")
			.send(incVotesObj)
			.expect(200)
			.then((res) => {
				expect(typeof res.body).toBe("object");
				const review = res.body.review;
				expect(review.length).toBe(1);
				expect(typeof review[0].review_id).toBe("number");
				expect(typeof review[0].title).toBe("string");
				expect(typeof review[0].category).toBe("string");
				expect(typeof review[0].designer).toBe("string");
				expect(typeof review[0].owner).toBe("string");
				expect(typeof review[0].review_img_url).toBe("string");
				expect(typeof review[0].created_at).toBe("string");
				expect(typeof review[0].votes).toBe("number");
				expect(review[0].votes).toBe(-10);
			});
	});
	test("PATCH - status 200 - Responds with an unmodified review when passed an empty inc_votes object", () => {
		const incVotesObj = {};
		return request(app)
			.patch("/api/reviews/1")
			.send(incVotesObj)
			.expect(200)
			.then((res) => {
				expect(typeof res.body).toBe("object");
				const review = res.body.review;
				expect(review.length).toBe(1);
				expect(typeof review[0].review_id).toBe("number");
				expect(typeof review[0].title).toBe("string");
				expect(typeof review[0].category).toBe("string");
				expect(typeof review[0].designer).toBe("string");
				expect(typeof review[0].owner).toBe("string");
				expect(typeof review[0].review_img_url).toBe("string");
				expect(typeof review[0].created_at).toBe("string");
				expect(typeof review[0].votes).toBe("number");
				expect(review[0].votes).toBe(1);
			});
	});
	test("PATCH - status 400 - Responds with an invalid request error message when passed an invalid review_id", () => {
		const incVotesObj = { inc_votes: 10 };
		return request(app)
			.patch("/api/reviews/one")
			.send(incVotesObj)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid request");
			});
	});
	test("PATCH - status 400 - Responds with an error message when passed a review_id whose value is not a number", () => {
		const incVotesObj = { inc_votes: "one" };
		return request(app)
			.patch("/api/reviews/one")
			.send(incVotesObj)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid request");
			});
	});
	test("PATCH - status 404 - Responds with an error message when passed a review_id which returns no results", () => {
		const incVotesObj = { inc_votes: 10 };
		return request(app)
			.patch("/api/reviews/1000")
			.send(incVotesObj)
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
	test("GET - status 200 - Responds with an object containing an array of all reviews, filtered by the given category", () => {
		return request(app)
			.get("/api/reviews?category=dexterity")
			.expect(200)
			.then((res) => {
				expect(typeof res.body).toBe("object");
				expect(res.body.reviews.length).toBe(1);
				res.body.reviews.forEach((review) => {
					expect(review.category).toBe("dexterity");
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
	test("GET - status 200 - When passed a non-existent category, responds with an object containing an empty array of reviews", () => {
		return request(app)
			.get("/api/reviews?category=fake")
			.expect(200)
			.then((res) => {
				expect(typeof res.body).toBe("object");
			});
	});
	test("GET - status 200 - Responds with an object containing an array of all reviews, sorted by date (default) and ordered descending (default)", () => {
		return request(app)
			.get("/api/reviews")
			.expect(200)
			.then((res) => {
				expect(res.body.reviews).toBeSortedBy("created_at", {
					descending: true,
				});
			});
	});
	test("GET - status 200 - Responds with an object containing an array of all reviews, sorted by date (default) and ordered ascending", () => {
		return request(app)
			.get("/api/reviews?order_by=asc")
			.expect(200)
			.then((res) => {
				expect(res.body.reviews).toBeSortedBy("created_at", {
					descending: false,
				});
			});
	});
	test("GET - status 200 - Responds with an object containing an array of all reviews, sorted by title and ordered descending (default)", () => {
		return request(app)
			.get("/api/reviews?sort_by=title")
			.expect(200)
			.then((res) => {
				expect(res.body.reviews).toBeSortedBy("title", {
					descending: true,
				});
			});
	});
	test("GET - status 200 - Responds with an object containing an array of all reviews, sorted by title and ordered ascending", () => {
		return request(app)
			.get("/api/reviews?sort_by=votes&&order_by=asc")
			.expect(200)
			.then((res) => {
				expect(res.body.reviews).toBeSortedBy("votes", {
					descending: false,
				});
			});
	});
	test("GET - status 400 - Responds with an error message when passed an invalid sort_by query", () => {
		return request(app)
			.get("/api/reviews?sort_by=title&&order_by=up")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid sort order query");
			});
	});
	test("GET - status 400 - Responds with an error message when passed an invalid order_by query", () => {
		return request(app)
			.get("/api/reviews?sort_by=something&&order_by=asc")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid order by query");
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
				expect(Array.isArray(res.body.comments)).toBe(true);
				expect(res.body.comments).toEqual([]);
				expect(res.body.comments.length).toBe(0);
			});
	});
	test("GET - status 400 - Responds with an invalid request error message when passed an invalid review_id", () => {
		return request(app)
			.get("/api/reviews/one/comments")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid request");
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
	test("POST - status 201 - Responds with the newly posted comment", () => {
		const newComment = {
			username: "bainesface",
			body: "Test comment",
		};
		return request(app)
			.post("/api/reviews/1/comments")
			.send(newComment)
			.expect(201)
			.then((res) => {
				const { comment } = res.body;
				expect(typeof comment).toBe("object");
				expect(comment[0].comment_id).toBe(7);
				expect(comment[0].body).toBe("Test comment");
				expect(comment[0].votes).toBe(0);
				expect(comment[0].author).toBe("bainesface");
				expect(comment[0].review_id).toBe(1);
				expect(comment[0].created_at).not.toBe(undefined);
			});
	});
	test("POST - status 400 - Responds with 'Comment body and username are both required' when body is not provided", () => {
		const badComment1 = {
			username: "bainesface",
		};
		return request(app)
			.post("/api/reviews/1/comments")
			.send(badComment1)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe(
					"Comment body and username are both required"
				);
			});
	});
	test("POST - status 400 - Responds with 'Comment body and username are both required' when username is not provided", () => {
		const badComment2 = {
			body: "Bad comment",
		};
		return request(app)
			.post("/api/reviews/1/comments")
			.send(badComment2)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe(
					"Comment body and username are both required"
				);
			});
	});
	test("POST - status 400 - Responds with 'Comment body and username are both required' when neither of these is provided", () => {
		const badComment3 = {};
		return request(app)
			.post("/api/reviews/1/comments")
			.send(badComment3)
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe(
					"Comment body and username are both required"
				);
			});
	});
	test("POST - status 400 - Responds with an invalid request error message when passed an invalid review_id", () => {
		const newComment = {
			username: "bainesface",
			body: "Test comment",
		};
		return request(app)
			.post("/api/reviews/one/comments")
			.send(newComment)
			.expect(400)
			.then((res) => expect(res.body.msg).toBe("Invalid request"));
	});
	test("POST - status 404 - Responds with an error message when passed a potentially valid review_id which doesn't exist", () => {
		const newComment = {
			username: "bainesface",
			body: "Test comment",
		};
		return request(app)
			.post("/api/reviews/1000/comments")
			.send(newComment)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("Review_id not found");
			});
	});
	test("POST - status 404 - Responds with an error message when passed a username which doesn't exist", () => {
		const newComment = {
			username: "fake-user",
			body: "Test comment",
		};
		return request(app)
			.post("/api/reviews/1/comments")
			.send(newComment)
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("Username not found");
			});
	});
});

describe("/api/comments/:comment_id", () => {
	test("DELETE - status 204 - responds with status 204 and no response data", () => {
		return request(app)
			.delete("/api/comments/1")
			.expect(204)
			.then((res) => {
				expect(res.data).toBe(undefined);
			});
	});
	test("DELETE - status 400 - responds with an error message when passed an invalid id", () => {
		return request(app)
			.delete("/api/comments/something")
			.expect(400)
			.then((res) => {
				expect(res.body.msg).toBe("Invalid request");
			});
	});
	test("DELETE - status 400 - responds with an error message when passed an id that does not exist", () => {
		return request(app)
			.delete("/api/comments/1000")
			.expect(404)
			.then((res) => {
				expect(res.body.msg).toBe("Comment ID 1000 not found");
			});
	});
});
