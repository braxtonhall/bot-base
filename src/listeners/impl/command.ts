import {Listener} from "../Listener";
import {getCommand, isCommandFormatted, parseCommandNameAndArgs} from "../../commands/Command";
import {Client, Message} from "discord.js";

const issueCommand: Listener<"messageCreate"> = {
    event: "messageCreate",
    procedure: async (client: Client, message: Message) => {
        if (await isCommandFormatted(message)) {
            const {commandName, args} = await parseCommandNameAndArgs(message);
            console.info(`Issuing command "${commandName}" with arguments:`, args);
            try {
                await getCommand(commandName)?.procedure(client, message, args);
            } catch (err) {
                console.error(`Command "${commandName}" failed. Reason:`, err);
            }
        }
    },
};

export default issueCommand;
