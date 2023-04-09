import {Client, Message} from "discord.js";
import {Command} from "../Command";
import PrefixController from "../../controllers/PrefixController";

const prefix: Command = {
	name: "prefix",
	description: "Updates the prefix for commands",
	usage: "prefix <newPrefix>",
	procedure: async (client: Client, message: Message, args: string[]) => {
		const [arg] = args;
		let reply;
		if (arg) {
			try {
				await PrefixController.setPrefix(arg);
				reply = `Prefix has been updated to \`${arg}\``;
			} catch (err) {
				reply = err.message;
			}
		} else {
			reply = "New prefix required";
		}
		return message.channel.send(reply);
	},
};

export default prefix;
