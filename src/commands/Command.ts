import {batchImport} from "../util/batchImport";
import {Client, Message} from "discord.js";
import PrefixController from "../controllers/PrefixController";
import Log from "../util/Log";
import RecursionController from "../controllers/RecursionController";

interface Command {
	name: string;
	description: string;
	usage: string;
	procedure: (client: Client, message: Message, args: string[]) => void;
}

const isCommand = (maybeCommand: any): maybeCommand is Command =>
	!!maybeCommand?.name && !!maybeCommand?.description && !!maybeCommand?.usage && !!maybeCommand?.procedure?.call;

const commands: Map<string, Command> = new Map();
const registerCommands = async (client: Client, directory: string): Promise<Client> => {
	const [futureUserImports, futureServiceImports] = [batchImport(directory), batchImport(`${__dirname}/impl`)];
	const [userImports, serviceImports] = await Promise.all([futureUserImports, futureServiceImports]);
	// Put help and prefix first so they can be overridden
	const importedFiles = [...serviceImports, ...userImports];
	importedFiles
		.map((importedFile) => importedFile.default)
		.forEach((command) => {
			if (isCommand(command)) {
				commands.set(command.name, command);
				Log.info(`Registered command "${command.name}"`);
			}
		});
	return client;
};

const getCommand = (command: string): Command => commands.get(command);

const listCommands = (): Command[] => Array.from(commands.values());

const isCommandFormatted = async (message: Message): Promise<boolean> => {
	const [prefix, recursive] = await Promise.all([
		PrefixController.getPrefix(),
		RecursionController.isRecursionAllowed(),
	]);
	// is from a person and is prefixed and is from a guild
	return message.guild && (recursive || message.author.bot === false) && message.content.trim().startsWith(prefix);
};

const parseCommandNameAndArgs = async (message: Message): Promise<{commandName: string; args: string[]}> => {
	const prefix = await PrefixController.getPrefix();
	const contentWithoutPrefix = message.content.replace(prefix, "");
	const trimmedContent = contentWithoutPrefix.trim();
	const tokens = trimmedContent.split(/\s/).filter((s) => !!s);
	const commandName = tokens[0] ?? "";
	const args = tokens.slice(1);
	return {commandName, args};
};

export {Command, registerCommands, listCommands, getCommand, isCommandFormatted, parseCommandNameAndArgs};
