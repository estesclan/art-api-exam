const { compose, head, split, toLower, join, tail } = require("ramda")

//const stringWithTheA = "The Way We Were"

const isTheA = compose(head, split(" "), toLower)(stringWithTheA)

const cleanString = if (isTheA === "the" || "a") {
	compose(join(" "), tail, split(" "), toLower)(stringWithTheA)
}

module.exports = cleanString
