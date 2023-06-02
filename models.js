const connection = require("./db/connection");
const { checkReviewIdExists } = require("./query-utils");

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

exports.selectReviews = (category) => {
	const queryValues = [];

	let selectReviewsQuery = `
	SELECT 
	reviews.review_id, reviews.title, reviews.category, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes, 
	COUNT(comments.comment_id)::INTEGER AS comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id`;

	if (category) {
		selectReviewsQuery += ` WHERE reviews.category = $1`;
		queryValues.push(category);
	}

	selectReviewsQuery += ` GROUP BY reviews.review_id
	ORDER BY reviews.created_at DESC;`;

	return connection.query(selectReviewsQuery, queryValues).then((res) => {
		return res.rows;
	});
};

exports.selectCommentsByReviewID = (reviewID) => {
	const commentsByReviewIdQuery = `SELECT * FROM comments WHERE review_id = $1 ORDER BY comments.created_at DESC;`;
	const checkReviewIdExistsPromise = checkReviewIdExists(reviewID);
	const commentsByReviewIdQueryPromise = connection.query(
		commentsByReviewIdQuery,
		[reviewID]
	);
	return Promise.all([
		checkReviewIdExistsPromise,
		commentsByReviewIdQueryPromise,
	]).then((res) => {
		return res[1].rows;
	});
};

exports.createComment = (username, body, review_id) => {
	const createCommentValues = [username, body, review_id];
	const createCommentQuery = `INSERT INTO comments (author, body, review_id) VALUES ($1, $2, $3) RETURNING *;`;
	const checkReviewIdExistsPromise = checkReviewIdExists(review_id);
	const createCommentQueryPromise = connection.query(
		createCommentQuery,
		createCommentValues
	);
	return Promise.all([
		checkReviewIdExistsPromise,
		createCommentQueryPromise,
	]).then((res) => {
		return res[1].rows;
	});
};

exports.editReviewVotes = (review_id, inc_votes) => {
	const editReviewValues = [review_id, inc_votes];
	const editReviewQuery = `
	UPDATE reviews
	SET votes = votes + $2
	WHERE review_id = $1
	RETURNING *;`;
	const checkReviewIdExistsPromise = checkReviewIdExists(review_id);
	const editReviewQueryPromise = connection.query(
		editReviewQuery,
		editReviewValues
	);
	return Promise.all([checkReviewIdExistsPromise, editReviewQueryPromise]).then(
		(res) => {
			return res[1].rows;
		}
	);
};
