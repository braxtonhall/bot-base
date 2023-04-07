import {
	BitFieldResolvable,
	Client,
	IntentsString,
	PartialTypes,
} from "discord.js";
import { registerCommands } from "./commands/Command";
import { registerListeners } from "./listeners/Listener";
import { Log } from "./index";

type Options = {
	commandDirectory: string;
	listenerDirectory: string;
	intents: BitFieldResolvable<IntentsString, number>;
	token: string;
	partials?: PartialTypes[];
	logChannel?: string;
};

const startDiscord = async (options: Options): Promise<Client> => {
	const { commandDirectory, listenerDirectory, intents, token, partials } =
		options;
	const client = new Client({ intents, partials });
	const withCommands = await registerCommands(client, commandDirectory);
	const withListeners = await registerListeners(
		withCommands,
		listenerDirectory
	);
	await withListeners.login(token);
	if (options.logChannel) {
		Log.stream(client, options.logChannel);
	}
	return client;
};

export { startDiscord };
