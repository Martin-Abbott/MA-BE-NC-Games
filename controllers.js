const {
	selectCategories,
	selectReviewByID,
	selectReviews,
	selectCommentsByReviewID,
	createComment,
	editReviewVotes,
} = require("./models");
const fs = require("fs/promises");

exports.getCategories = (req, res, next) => {
	selectCategories()
		.then((categories) => {
			res.status(200).send({ categories });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getAPI = (req, res, next) => {
	fs.readFile(`${__dirname}/endpoints.json`)
		.then((endpoints) => {
			const parsedEndpoints = JSON.parse(endpoints);
			res.status(200).send({ endpoints: parsedEndpoints });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getReviewByID = (req, res, next) => {
	const { review_id } = req.params;
	selectReviewByID(review_id)
		.then((review) => {
			res.status(200).send({ review });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getReviews = (req, res, next) => {
	const { category } = req.query;
	selectReviews(category)
		.then((reviews) => {
			res.status(200).send({ reviews });
		})
		.catch((err) => {
			next(err);
		});
};

exports.getCommentsByReviewID = (req, res, next) => {
	const { review_id } = req.params;
	selectCommentsByReviewID(review_id)
		.then((comments) => {
			res.status(200).send({ comments });
		})
		.catch((err) => {
			next(err);
		});
};

exports.postComment = (req, res, next) => {
	const { review_id } = req.params;
	const { username, body } = req.body;
	if (!username || !body) {
		res
			.status(400)
			.send({ msg: "Comment body and username are both required" });
	} else {
		createComment(username, body, review_id)
			.then((comment) => {
				res.status(201).send({ comment });
			})
			.catch((err) => {
				next(err);
			});
	}
};

exports.modifyReviewVotes = (req, res, next) => {
	const { review_id } = req.params;
	const { inc_votes } = req.body;
	if (inc_votes === undefined || inc_votes === {}) {
		selectReviewByID(review_id).then((review) => {
			res.status(200).send({ review });
		});
	} else {
		editReviewVotes(review_id, inc_votes)
			.then((review) => {
				res.status(200).send({ review });
			})
			.catch((err) => {
				next(err);
			});
	}
};
