import {batchImport} from "../util/batchImport";
import {Client, ClientEvents, Events} from "discord.js";
import Log from "../util/Log";

type Event = keyof ClientEvents;

interface Listener<T extends Event = Event> {
	event: T;
	procedure: (client: Client, ...args: ClientEvents[T]) => void;
}

const isListener = (maybeListener: any): maybeListener is Listener =>
	Object.values(Events).includes(maybeListener?.event) && !!maybeListener?.procedure?.call;

const registerListeners = async (client: Client, directory: string): Promise<Client> => {
	const [futureUserImports, futureServiceImports] = [batchImport(directory), batchImport(`${__dirname}/impl`)];
	const [userImports, serviceImports] = await Promise.all([futureUserImports, futureServiceImports]);
	const importedFiles = [...serviceImports, ...userImports];
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
