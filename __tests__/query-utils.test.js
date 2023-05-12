const { checkReviewIdExists, checkUsernameExists } = require("../query-utils");

const app = require("../app");
const connection = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

afterAll(() => {
	connection.end();
});

beforeAll(() => {
	return seed(data);
});

describe("checkReviewIdExists", () => {
	test("When passed a valid review_id, the checkReviewIdExists function should return an empty promise object", () => {
		expect(typeof checkReviewIdExists(1)).toBe("object");
		expect(checkReviewIdExists(1).length).toBe(undefined);
		checkReviewIdExists(1).then((res) => {
			expect(res).toBe(undefined);
		});
	});
	test("when passed an invalid review_id, the checkReviewIdExists function should return a rejected promise, with status 404 and a message: 'Review_id not found'", () => {
		expect(typeof checkReviewIdExists(20)).toBe("object");
		expect(checkReviewIdExists(20).length).toBe(undefined);
		checkReviewIdExists(20).then((res) => {
			expect(res).toBe({
				msg: "Review_id not found",
				status: 404,
			});
		});
	});
});

describe("checkUsernameExists", () => {
	test("When passed a valid username, the checkUsernameExists function should return an empty promise object", () => {
		expect(typeof checkUsernameExists("dav3rid")).toBe("object");
		expect(checkUsernameExists("dav3rid").length).toBe(undefined);
		checkUsernameExists("dav3rid").then((res) => {
			expect(res).toBe(undefined);
		});
	});
	test("when passed an invalid username, the checkUsernameExists function should return a rejected promise, with status 404 and a message: 'Username not found'", () => {
		expect(typeof checkUsernameExists("dave")).toBe("object");
		expect(checkUsernameExists("dave").length).toBe(undefined);
		checkUsernameExists("dave").then((res) => {
			expect(res).toBe({
				msg: "Username not found",
				status: 404,
			});
		});
	});
});
