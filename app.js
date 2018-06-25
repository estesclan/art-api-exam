require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT || 5001
const NodeHTTPError = require("node-http-error")
const { pathOr, propOr, isEmpty, compose, not, join } = require("ramda")
const reqFieldChecker = require("./lib/required-field-check")
const {
	// addBoard,
	// getBoard,
	// listBoards,
	// updateBoard,
	// deleteBoard
} = require("./dal")

app.use(bodyParser.json())

app.get("/", function(req, res, next) {
	res.send("Welcome to the Art API. Manage all the paintings.")
})

app.listen(port, () =>
	console.log("Good artists borrow... Great artists steal :)", port)
)
