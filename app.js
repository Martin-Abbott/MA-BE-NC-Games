const express = require("express");
const app = express();
const { getCategories, getAPI } = require("./controllers");

app.get("/api/categories", getCategories);

app.get("/api", getAPI);

app.use((req, res, next) => {
	res.status(404).send({ msg: "Invalid URL" });
});

app.use((err, req, res, next) => {
	if (err.status && err.msg) {
		res.status(err.status).send({ msg: err.msg });
	} else {
		res.status(500).send({ msg: "Server Error" });
	}
});

module.exports = app;
