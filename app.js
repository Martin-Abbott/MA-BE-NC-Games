const express = require("express");
const app = express();
const {
	getCategories,
	getAPI,
	getReviewByID,
	getReviews,
	getCommentsByReviewID,
	postComment,
	modifyReviewVotes,
} = require("./controllers");
const cors = require("cors");

app.use(express.json());

app.use(cors());

app.get("/api/categories", getCategories);

app.get("/api", getAPI);

app.get("/api/reviews/:review_id", getReviewByID);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", modifyReviewVotes);

app.use((req, res, next) => {
	res.status(404).send({ msg: "Invalid URL" });
});

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else if (err.code === "22P02") {
		res.status(400).send({ msg: "Invalid request" });
	} else if (err.code === "23503") {
		res.status(404).send({ msg: "Username not found" });
	} else {
		res.status(500).send({ msg: "Server Error" });
	}
});

module.exports = app;
