const connection = require("./db/connection");

exports.selectCategories = () => {
	return connection.query("SELECT * FROM categories;").then((res) => {
		return res.rows;
	});
};

exports.selectReviewByID = (reviewID) => {
	const reviewIdQuery = `SELECT * FROM reviews WHERE review_id = $1;`;
	return connection.query(reviewIdQuery, [reviewID]).then((res) => {
		if (!res.rows.length) {
			return Promise.reject({
				status: 404,
				msg: "Review_id not found",
			});
		} else {
			return res.rows;
		}
	});
};

exports.selectReviews = () => {
	const selectReviewsQuery = `
	SELECT 
	reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes, 
	COUNT(comments.comment_id)::INTEGER AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id 
	GROUP BY reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes
	ORDER BY reviews.created_at DESC;
	`;
	return connection.query(selectReviewsQuery).then((res) => {
		return res.rows;
	});
};
