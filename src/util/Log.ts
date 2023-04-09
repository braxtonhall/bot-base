import {Client} from "discord.js";
import {debounce} from "debounce";

enum LogLevel {
	DEBUG,
	INFO,
	WARN,
	ERROR,
	NONE,
}

const LOG_LEVEL: LogLevel =
	{
		DEBUG: LogLevel.DEBUG,
		INFO: LogLevel.INFO,
		WARN: LogLevel.WARN,
		ERROR: LogLevel.ERROR,
		NONE: LogLevel.NONE,
	}[process.env.LOG_LEVEL] ?? LogLevel.NONE;

const debug = (...msg: unknown[]): void => {
	if (LOG_LEVEL <= LogLevel.DEBUG) {
		log("debug", "🐞", ...msg);
	}
};

const info = (...msg: unknown[]): void => {
	if (LOG_LEVEL <= LogLevel.INFO) {
		log("info", "ℹ", ...msg);
	}
};

const warn = (...msg: unknown[]): void => {
	if (LOG_LEVEL <= LogLevel.WARN) {
		log("warn", "⚠", ...msg);
	}
};

const error = (...msg: unknown[]): void => {
	if (LOG_LEVEL <= LogLevel.ERROR) {
		log("error", "❌", ...msg);
	}
};

const listeners: {client: Client; channelId: string}[] = [];

let messageQueue: string[] = [];

const log = (method: "debug" | "info" | "warn" | "error", emoji: string, ...msg): void => {
	const prefix = `<${emoji}> ${new Date().toLocaleString()}:`;
	console[method](prefix, ...msg);
	const message = [prefix, ...msg.map((message) => JSON.stringify(message))].join(" ");
	messageQueue.push(message);
	void logToListeners();
};

const logToListeners = debounce(async () => {
	const message = messageQueue.map((msg) => `${msg}`).join("\n");
	messageQueue = [];
	const futureChannels = listeners.map(({client, channelId}) => client.channels.fetch(channelId));
	const maybeChannels = await Promise.all(futureChannels);
	const channels = maybeChannels.filter((channel) => !!channel);
	channels.forEach((channel) => {
		if (channel.isTextBased()) {
			void channel.send(message);
		}
	});
}, 3000);

const stream = (client: Client, channelId: string) => void listeners.push({client, channelId});

export default {debug, info, warn, error, stream};
