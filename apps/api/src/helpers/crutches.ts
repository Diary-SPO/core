export const crutchesInit = () => {
	// @ts-ignore
	BigInt.prototype.toJSON = function() { return this.toString() }
}