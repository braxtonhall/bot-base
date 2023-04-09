import { Command } from "../Command";

const kill: Command = {
	name: "kill",
	description: "Kills the bot",
	usage: "kill",
	procedure: () => process.exit(0),
};

export default kill;
