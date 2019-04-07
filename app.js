const express = require("express")
const mineping = require("mineping");

var app = express()

app.set("etag", "strong")

app.use(function(req, res, next) {
	res.removeHeader("x-powered-by")
	
	res.jsonProblem = function(obj) {		
		res.header("Content-Type", "application/problem+json")
		res.json(obj)
	}
	
	res.jsonResponse = function(obj) {		
		res.header("Content-Type", "application/json")
		res.json(obj)
	}
	
	next()
})

// main
app.get("/api/:ip/:port?", function (req, res, next) {
	const address = req.params.ip;
	const port = req.params.port || 25565;

	mineping(3, address, port, function(err, response) {
		if (err)
			return res.status(500).jsonProblem({ err });
		else {
			return res.status(200).jsonResponse({ response });
		}
	});
})

module.exports = app;
