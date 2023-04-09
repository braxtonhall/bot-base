import {Client, Message} from "discord.js";
import {Command} from "../Command";
import RecursionController from "../../controllers/RecursionController";

const parseArgument = (arg: string): boolean => {
	if (["t", "true", "1", "#true", "#t"].includes(arg.toLowerCase())) {
		return true;
	} else if (["f", "false", "0", "#false", "#f"].includes(arg.toLowerCase())) {
		return false;
	} else {
		throw new Error("Argument should be a boolean");
	}
};

const recursive: Command = {
	name: "recursive",
	description: "Sets whether or not the bot can call itself",
	usage: "recursive <boolean>",
	procedure: async (client: Client, message: Message, args: string[]) => {
		const [input] = args;
		let reply;
		if (input) {
			try {
				const argument = parseArgument(input);
				await RecursionController.setRecursionAllowed(argument);
				reply = argument ? "Recursion enabled" : "Recursion disabled";
			} catch (err) {
				reply = err.message;
			}
		} else {
			reply = "Argument `true` or `false` required.";
		}
		return message.channel.send(reply);
	},
};

export default recursive;
