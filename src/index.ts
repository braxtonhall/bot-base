import {startDiscord} from "./startDiscord";
import {DatabaseController, getDatabaseController} from "./controllers/database/DatabaseController";
import {Listener} from "./listeners/Listener";
import {Command, getCommand} from "./commands/Command";
import Log from "./util/Log";
import PrefixController from "./controllers/PrefixController";

const {getPrefix} = PrefixController;

export {startDiscord, getCommand, getDatabaseController, getPrefix, Log};

export type {DatabaseController, Listener, Command};
