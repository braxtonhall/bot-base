import {createController} from "./Controller";

const DEFAULT_PREFIX = "!";
const ILLEGAL_PREFIXES = ["/", "@", "#"];

const assert = (scrutinee: boolean, reason: string) => {
	if (!scrutinee) {
		throw new Error(reason);
	}
};

const {getValue, setValue} = createController({
	defaultValue: DEFAULT_PREFIX,
	name: "prefix",
	assertion: (newPrefix) => {
		assert(newPrefix.length === 1, "Prefix must be of length 1");
		assert(!!newPrefix, "Prefix must not be whitespace");
		assert(!/[a-zA-Z0-9]/.test(newPrefix), "Prefix should not be alphanumeric");
		assert(!ILLEGAL_PREFIXES.includes(newPrefix), `"${newPrefix}" is not a legal prefix`);
	},
});

export default {
	setPrefix: setValue,
	getPrefix: getValue,
};
