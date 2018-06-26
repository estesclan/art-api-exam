const { compose, head, split, toLower, join, tail } = require("ramda")

//const stringWithTheA = "The Way We Were"

const isTheA = compose(head, split(" "), toLower)

const cleanString = function(stringWithTheA) {
	if (isTheA(stringWithTheA) === "the" || isTheA(stringWithTheA) === "a") {
		return compose(join(" "), tail, split(" "), toLower)(stringWithTheA)
	}
	return stringWithTheA
}

module.exports = cleanString
