const connection = require("./db/connection");

exports.selectCategories = () => {
	return connection.query("SELECT * FROM categories;").then((res) => {
		return res.rows;
	});
};

exports.selectReview = (reviewID) => {
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
