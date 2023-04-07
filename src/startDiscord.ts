import {
	BitFieldResolvable,
	Client,
	GatewayIntentsString,
	Partials,
} from "discord.js";
import { registerCommands } from "./commands/Command";
import { registerListeners } from "./listeners/Listener";

type Options = {
	commandDirectory: string;
	listenerDirectory: string;
	intents: BitFieldResolvable<GatewayIntentsString, number>;
	token: string;
	partials?: Partials[];
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
	return client;
};

export { startDiscord };
