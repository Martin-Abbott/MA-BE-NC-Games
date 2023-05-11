const express = require("express");
const app = express();
const {
	getCategories,
	getAPI,
	getReviewByID,
	getReviews,
	getCommentsByReviewID,
} = require("./controllers");

app.get("/api/categories", getCategories);

app.get("/api", getAPI);

app.get("/api/reviews/:review_id", getReviewByID);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id/comments", getCommentsByReviewID);

app.use((req, res, next) => {
	res.status(404).send({ msg: "Invalid URL" });
});

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else if (err.code === "22P02") {
		res.status(400).send({ msg: "Invalid review_id" });
	} else {
		res.status(500).send({ msg: "Server Error" });
	}
});

module.exports = app;
