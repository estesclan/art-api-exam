require("dotenv").config()
const express = require("express")
const app = express()
const port = process.env.PORT || 5001
const bodyParser = require("body-parser")
const NodeHTTPError = require("node-http-error")
const { pathOr, propOr, isEmpty, compose, not, join } = require("ramda")
const checkRequiredFields = require("./lib/check-required-fields")
const createMissingFieldMsg = require("./lib/create-missing-field-msg")
const cleanObj = require("./lib/clean-obj")

const {
	getPainting,
	deletePainting,
	addPainting,
	listPaintings,
	putPainting
} = require("./dal")

app.use(bodyParser.json())

app.get("/", function(req, res, next) {
	res.send("Welcome to the Art API. Manage all the paintings.")
})

app.get("/paintings/:paintingID", function(req, res, next) {
	const paintingID = req.params.paintingID
	//console.log("paintingID", paintingID)
	getPainting(paintingID, function(err, data) {
		if (err) {
			next(new NodeHTTPError(err.status, err.message, err))
			return
		}
		res.status(200).send(data)
	})
})

////////

app.get("/paintings", function(req, res, next) {
	const limit = Number(pathOr(5, ["query", "limit"], req))
	const paginate = pathOr(null, ["query", "start_key"], req)
	listPaintings(limit, paginate, function(err, paintings) {
		if (err) {
			next(new NodeHTTPError(err.status, err.message, err))
			return
		}
		res.status(200).send(paintings)
	})
})

////////

app.post("/paintings", function(req, res, next) {
	const newPainting = propOr({}, "body", req)
	//console.log("newPainting", newPainting)
	if (isEmpty(newPainting)) {
		next(
			new NodeHTTPError(
				400,
				"Missing painting in body. Insure the Content-Type is application JSON"
			)
		)
	}

	const requiredFields = ["name", "movement", "artist", "yearCreated", "museum"]
	const missingFields = checkRequiredFields(requiredFields, newPainting)

	if (not(isEmpty(checkRequiredFields(requiredFields, newPainting)))) {
		next(new NodeHTTPError(400, ` ${createMissingFieldMsg(missingFields)}`))
	}

	//const cleanedPainting = cleanObj(requiredFields, newPainting)

	addPainting(newPainting, function(err, data) {
		if (err) {
			next(new NodeHTTPError(err.status, err.message, err))
		}
		res.status(201).send(data)
	})
})

////////////

app.put("/paintings/:paintingID", function(req, res, next) {
	const paintingToUpdate = propOr({}, "body", req)
	const requiredFields = [
		"_id",
		"_rev",
		"name",
		"movement",
		"artist",
		"yearCreated",
		"museum"
	]
	const requiredMuseumFields = ["name", "location"]
	const missingMuseumFields = checkRequiredFields(
		requiredMuseumFields,
		paintingToUpdate
	)
	const missingFields = checkRequiredFields(requiredFields, paintingToUpdate)
	//console.log("missingFields", missingFields)
	if (not(isEmpty(checkRequiredFields(requiredFields, paintingToUpdate)))) {
		next(new NodeHTTPError(400, ` ${createMissingFieldMsg(missingFields)}`))
	}
	if (
		not(isEmpty(checkRequiredFields(requiredMuseumFields, paintingToUpdate)))
	) {
		next(
			new NodeHTTPError(400, ` ${createMissingFieldMsg(missingMuseumFields)}`)
		)
	}
	//couch does this!
	// if (!paintingToUpdate._rev) {
	// 	next(new NodeHTTPError(409, `Please include the most recent _rev value`))
	// }

	const cleanedPainting = cleanObj(requiredFields, paintingToUpdate)

	putPainting(paintingToUpdate, function(err, painting) {
		if (err) {
			next(new NodeHTTPError(err.status, err.message, err))
		}
		res.status(201).send(painting)
	})
})

//////////

app.delete("/paintings/:paintingID", function(req, res, next) {
	const paintingID = req.params.paintingID
	deletePainting(paintingID, function(err, data) {
		if (err) {
			next(new NodeHTTPError(err.status, err.message, err))
			return
		}
		res.status(200).send(data)
	})
})

app.use(function(err, req, res, next) {
	console.log(
		"ERROR! ",
		"METHOD: ",
		req.method,
		" PATH",
		req.path,
		" error:",
		JSON.stringify(err)
	)
	res.status(err.status || 500)
	res.send(err)
})
app.listen(port, () =>
	console.log("Good artists borrow... Great artists steal :)", port)
)
