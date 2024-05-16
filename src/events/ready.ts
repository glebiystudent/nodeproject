// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";

// Dependencies
import * as templates from "../config/templates";
import * as helper from "../helper_functions"

// Configs
import _config from "../config/config.json"
import __config from "../config/__config.json";

/**
 * The main function that will be invoked upon the event
 * @param client The discord client
 * @param args All the remaining arguments
 */
export const run: templates.event_function = async (client: Discord.Client, storage: templates.bot_storage, ...args: any): Promise<void> => {
    client?.user?.setActivity(`${__config.status} | $help`, {type: Discord.ActivityType.Streaming, url: "https://www.twitch.tv/alienbetrayer"});
    console.log("[BOOT] --- Everything has loaded. ---");
    console.log("[BOOT] --- === Client is ready! === ---");
}

/**
 * The event's config.
 */
export const config: templates.event_config = {
    name: "ready",
    noload: false
}

