import {Client} from "discord.js";
import {registerCommands} from "./commands/Command";
import {registerListeners} from "./listeners/Listener";

type Options = {commandDirectory: string, listenerDirectory: string, token: string};
const startDiscord = async (options: Options): Promise<Client> => {
    const {commandDirectory, listenerDirectory, token} = options;
    const client = new Client();
    const withCommands = await registerCommands(client, commandDirectory);
    const withListeners = await registerListeners(withCommands, listenerDirectory);
    await withListeners.login(token);
    return client;
};

export {startDiscord};
