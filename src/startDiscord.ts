import {BitFieldResolvable, Client, IntentsString} from "discord.js";
import {registerCommands} from "./commands/Command";
import {registerListeners} from "./listeners/Listener";

type Options = {
    commandDirectory: string,
    listenerDirectory: string,
    intents: BitFieldResolvable<IntentsString, number>,
    token: string
};

const startDiscord = async (options: Options): Promise<Client> => {
    const {commandDirectory, listenerDirectory, intents, token} = options;
    const client = new Client({intents});
    const withCommands = await registerCommands(client, commandDirectory);
    const withListeners = await registerListeners(withCommands, listenerDirectory);
    await withListeners.login(token);
    return client;
};

export {startDiscord};
