// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";

// Dependencies
import * as templates from "../config/templates";
import * as helper from "../helper_functions"

// Configs
import _config from "../config/config.json";
import __config from "../config/__config.json";

// Other events
import * as mention_event from "./mention";

/**
 * The main function that will be invoked upon the event
 * @param client The discord client
 * @param args All the remaining arguments
 */
export const run: templates.event_function = async (client: Discord.Client, storage: templates.bot_storage, ...args: any): Promise<void> => {
    // Args
    const message: Discord.Message = args[0];

    // If the message starts with a mention, run mention event
    if(message.content.startsWith(`<@${client?.user?.id}>`))
        return (async (): Promise<void> => { 
            mention_event.run(client, storage, message);
         })();

    // If the message does not start with a prefix, break out of this command
    if(!message.content.startsWith(_config.defaults.prefix))
        return;

    const parts: string[] = message.content.slice(_config.defaults.prefix.length).split(' ');
    const command_args: string[] = parts.slice(1);
    const command: string = parts[0];

    // Find the necessary command and run it.
    storage.commands.forEach((cmd: templates.command, names: string[]): void => {
        if(names.includes(command))
            cmd.run(client, message, storage, command_args);
    });
}

/**
 * The event's config.
 */
export const config: templates.event_config = {
    name: "message",
    noload: false
}
