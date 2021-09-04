# bot-base

## Example
### App
```typescript
import {startDiscord} from "@ubccpsc310/bot-base"

startDiscord({
    commandDirectory: `${__dirname}/commands`,
    listenerDirectory: `${__dirname}/listeners`,
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
    procedure: (client: Client, message: Message, args: string[]) => {
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
import {Listener} from "@ubccpsc310/bot-base";
import {Client} from "discord.js";

const ready: Listener<"ready"> = {
    event: "ready",
    procedure: function (client: Client) {
        console.info("Bot started 👀");
    }
}

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

interface Options {
    // Directory where Command ts/js files live
    // All files in this directory should have
    // a default export that is a Command
    commandDirectory: string;

    // Directory where Listener ts/js files live
    // All files in this directory should have
    // a default export that is a Listener
    listenerDirectory: string;

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
    get<T extends Entity>(collection: Collection, id: string): Promise<T>;
    set<T extends Entity>(collection: Collection, value: T): Promise<void>;
    scan<T extends Entity>(collection: Collection, query: any): Promise<T[]>;
    delete(collection: Collection, id: string): Promise<void>;
}

interface Entity {
    id: string;
}
```
