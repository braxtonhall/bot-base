import {Listener} from "../Listener";
import {Client, Message} from "discord.js";
import PrefixController from "../../controllers/PrefixController";
import Log from "../../util/Log";

const mentionBot: Listener<"messageCreate"> = {
	event: "messageCreate",
	procedure: async (client: Client, message: Message) => {
		if (message.author.bot === false && !message.reference && message.mentions.has(client.user.id)) {
			Log.info(`${message.author.username} mentioned the bot`);
			const prefix = await PrefixController.getPrefix();
			return message.channel.send(`Did someone mention me? Try \`${prefix}help\` instead.`);
		}
	},
};

export default mentionBot;
