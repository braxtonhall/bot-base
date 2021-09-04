import {Listener} from "../Listener";
import {Client, Message} from "discord.js";
import PrefixController from "../../controllers/PrefixController";

const mentionBot: Listener<"message"> = {
    event: "message",
    procedure: (client: Client) => async (message: Message) => {
        if (message.author.bot === false && !message.reference && message.mentions.has(client.user.id)) {
            console.info(`${message.author.username} mentioned the bot`);
            const prefix = await PrefixController.getPrefix();
            return message.channel.send(`Did someone mention me? Try \`${prefix}help\` instead.`);
        }
    },
};

export default mentionBot;
