const connection = require("./db/connection");

exports.checkReviewIdExists = (review_id) => {
	if (review_id) {
		return connection
			.query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
			.then((res) => {
				if (res.rows.length === 0) {
					return Promise.reject({ status: 404, msg: "Review_id not found" });
				}
			});
	}
};

exports.checkUsernameExists = (username) => {
	if (username) {
		return connection
			.query("SELECT * FROM users WHERE username = $1", [username])
			.then((res) => {
				if (res.rows.length === 0) {
					return Promise.reject({ status: 404, msg: "Username not found" });
				}
			});
	}
};
