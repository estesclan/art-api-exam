const PouchDB = require("pouchdb")
PouchDB.plugin(require("pouchdb-find"))
PouchDB.plugin(require("pouchdb-adapter-http"))
require("dotenv").config()

const { merge, prop, map, toLower } = require("ramda")
const pkGen = require("./lib/pk-gen")

const db = new PouchDB(
	`${process.env.COUCH_HOSTNAME}${process.env.COUCH_DBNAME}`
)

const getPainting = (id, callback) => db.get(id, callback)
///////

const addPainting = (painting, callback) => {
	//console.log("HI Im inside addPainting")

	const modifiedPainting = merge(painting, {
		type: "painting",
		_id: `painting_${toLower(painting.name)}`
	})
	//console.log("modifiedPainting", modifiedPainting)
	db.put(modifiedPainting, callback)
}
/////

const listPaintings = (limit, paginate, callback) =>
	db.allDocs(
		paginate
			? { include_docs: true, limit: limit, start_key: `${paginate}\ufff0` }
			: { include_docs: true, limit: limit },
		function(err, result) {
			if (err) callback(err)
			callback(null, map(row => row.doc, result.rows))
		}
	)

/////

const putPainting = (painting, callback) => {
	db.put(painting, callback)
}

//////

const deletePainting = (paintingID, callback) => {
	db.get(paintingID, function(err, doc) {
		if (err) {
			callback(err)
			return
		}
		db.remove(doc, function(err, deleteResult) {
			if (err) {
				callback(err)
				return
			}
			callback(null, deleteResult)
		})
	})
}

const dal = {
	getPainting,
	deletePainting,
	addPainting,
	listPaintings,
	putPainting
}

module.exports = dal
