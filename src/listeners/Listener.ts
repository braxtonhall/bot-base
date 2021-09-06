import {batchImport} from "../util/batchImport";
import {Client, ClientEvents, Constants} from "discord.js";
import Log from "../util/Log";

type Event = keyof ClientEvents;

interface Listener<T extends Event = Event> {
    event: T;
    procedure: (client: Client, ...args: ClientEvents[T]) => void;
}

const isListener = (maybeListener: any): maybeListener is Listener =>
    Object.values(Constants.Events).includes(maybeListener?.event) && !!maybeListener?.procedure?.call;

const registerListeners = async (client: Client, directory: string): Promise<Client> => {
    const [futureBatchImportedFiles, futureCommand, futureMentionBot] = [
        batchImport(directory),
        import(`${__dirname}/impl/command`),
        import(`${__dirname}/impl/mentionBot`),
    ];
    const [batchImportedFiles, command, mentionBot] = await Promise.all([
        futureBatchImportedFiles,
        futureCommand,
        futureMentionBot
    ]);
    const importedFiles = [command, mentionBot, ...batchImportedFiles];
    importedFiles
        .map((importedFile) => importedFile.default)
        .forEach((listener) => {
            if (isListener(listener)) {
                client.on(listener.event, async <T extends Event>(...args: ClientEvents[T]) => {
                    try {
                        await listener.procedure(client, ...args);
                    } catch (err) {
                        Log.error(`Listener for "${listener.event}" threw. Reason:`, err);
                    }
                });
                Log.info(`Registered listener for "${listener.event}"`);
            }
        });
    return client;
};

export {Listener, registerListeners};
