import { getDatabaseController } from "./database/DatabaseController";

const DEFAULT_PREFIX = "!";
const ILLEGAL_PREFIXES = ["/", "@", "#"];

type PrefixEntity = { id: "prefix"; prefix: string };

const database = getDatabaseController();

const assert = (scrutinee: boolean, reason: string) => {
	if (!scrutinee) {
		throw new Error(reason);
	}
};

let prefixCache: string;

const getPrefix = async (): Promise<string> => {
	const maybePrefix =
		prefixCache ??
		(await database.get<PrefixEntity>("prefix", "prefix"))?.prefix;
	prefixCache = maybePrefix ?? DEFAULT_PREFIX;
	return prefixCache;
};

const setPrefix = async (newPrefix: string): Promise<void> => {
	assert(newPrefix.length === 1, "Prefix must be of length 1");
	assert(!!newPrefix, "Prefix must not be whitespace");
	assert(!/[a-zA-Z0-9]/.test(newPrefix), "Prefix should not be alphanumeric");
	assert(
		!ILLEGAL_PREFIXES.includes(newPrefix),
		`"${newPrefix}" is not a legal prefix`
	);
	await database.set<PrefixEntity>("prefix", {
		id: "prefix",
		prefix: newPrefix,
	});
	prefixCache = newPrefix;
};

export default {
	setPrefix,
	getPrefix,
};
