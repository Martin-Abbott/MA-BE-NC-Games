const { selectCategories } = require("./models");
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
