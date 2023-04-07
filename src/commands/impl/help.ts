import { Command, getCommand, listCommands } from "../Command";
import { Client, Message, MessageEmbed } from "discord.js";
import PrefixController from "../../controllers/PrefixController";

const help: Command = {
	name: "help",
	description: "Displays list of commands",
	usage: "help <commandName>?",
	procedure: async (client: Client, message: Message, args: string[]) => {
		const [arg] = args;
		const prefix = await PrefixController.getPrefix();
		let reply;
		if (arg) {
			reply = displayCommandUsage(prefix, arg);
		} else {
			reply = displayAllCommands(prefix);
		}
		return message.channel.send(reply);
	},
};

const displayCommandUsage = (prefix: string, commandName: string) => {
	const command: Command = getCommand(commandName);
	if (command) {
		const embed = new MessageEmbed()
			.setTitle(`\`${prefix}${commandName}\``)
			.setDescription(command.description)
			.addField("Usage", `\`${prefix}${command.usage}\``);
		return { embeds: [embed] };
	} else {
		return `No such command: \`${commandName}\``;
	}
};

const displayAllCommands = (prefix: string) => {
	const commands: Command[] = listCommands().sort((a, b) =>
		a.name < b.name ? -1 : 1
	);
	const embed = new MessageEmbed()
		.setTitle("Commands")
		.addFields(...commands.map(toHelpLine(prefix)))
		.addField("\u200B", `Use \`${prefix}help <commandName>\` for usage`);
	return { embeds: [embed] };
};

const toHelpLine =
	(prefix: string) =>
	(command: Command): { name: string; value: string; inline: true } => {
		return {
			name: `\`${prefix}${command.name}\``,
			value: command.description,
			inline: true,
		};
	};

export default help;
