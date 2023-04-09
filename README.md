# bot-base

## Example

### App

```typescript
import {startDiscord} from "@ubccpsc310/bot-base";
import {Intents} from "discord.js";

startDiscord({
	commandDirectory: `${__dirname}/commands`,
	listenerDirectory: `${__dirname}/listeners`,
	intents: [Intents.FLAGS.GUILDS],
	token: process.env.DISCORD_BOT_TOKEN,
});
```

### Command

```typescript
import {Command} from "@ubccpsc310/bot-base";
import {Client, Message} from "discord.js";

const echo: Command = {
	name: "echo",
	description: "Repeats a message",
	usage: "echo <message>?",
	procedure(client: Client, message: Message, args: string[]) {
		let reply;
		if (args.length > 0) {
			reply = args.join(" ");
		} else {
			reply = "... echo";
		}
		return message.channel.send(reply);
	},
};

export default echo;
```

### Listener

```typescript
import {Listener, Log} from "@ubccpsc310/bot-base";
import {Client} from "discord.js";

const ready: Listener<"ready"> = {
	event: "ready",
	procedure(client: Client) {
		Log.info("Bot started 👀");
	},
};

export default ready;
```

## API

```typescript
/**
 * The main function!
 * Registers commands and listeners, and logs into discord
 * @param options are defined below
 * @return Discord.js Client
 */
function startDiscord(options: Options): Promise<Client> {
	// ...
}

/**
 * Returns a db object for persisting/reading data
 */
function getDatabaseController(): DatabaseController {
	// ...
}

/**
 * Logging object used in place of `console`
 * Only prints to console if logging level permits,
 * set by process.env variable `LOG_LEVEL`
 * which should be DEBUG | INFO | WARN | ERROR | NONE
 * (defaults to NONE)
 */
const Log: {
	debug(...args: any[]): void;
	info(...args: any[]): void;
	warn(...args: any[]): void;
	error(...args: any[]): void;
} = {
	/* ... */
};

interface Options {
	// Directory where Command ts/js files live
	// All files in this directory should have
	// a default export that is a Command
	commandDirectory: string;

	// Directory where Listener ts/js files live
	// All files in this directory should have
	// a default export that is a Listener
	listenerDirectory: string;

	// See https://discord.js.org/#/docs/main/stable/typedef/IntentsResolvable
	intents: IntentsResolvable;

	// Bot token found in Discord's
	// developer portal
	token: string;
}

interface Command {
	// name that users will invoke the command with
	name: string;
	description: string;
	// example of how to use the command
	usage: string;
	// procedure that should be invoked whenever command is used
	procedure: (client: Client, message: Message, args: string[]) => void;
}

// ClientEvents comes from discord.js
interface Listener<T extends keyof ClientEvents> {
	// example "message" or "voiceStateUpdate"
	event: T;
	// procedure that should be invoked whenever event occurs
	procedure: (client: Client, ...args: ClientEvents[T]) => void;
}

interface DatabaseController {
	get<T extends Entity>(collection: string, id: string): Promise<T>;
	set<T extends Entity>(collection: string, value: T): Promise<void>;
	scan<T extends Entity>(collection: string, query: any): Promise<T[]>;
	delete(collection: string, id: string): Promise<void>;
}

interface Entity {
	id: string;
}
```
