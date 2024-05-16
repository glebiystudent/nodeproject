// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";

// Dependencies
import * as templates from "../config/templates";
import * as helper from "../helper_functions"

// Configs
import _config from "../config/config.json";
import __config from "../config/__config.json";

/**
 * The main function that will be invoked upon the event
 * @param client The discord client
 * @param args All the remaining arguments
 */
export const run: templates.event_function = async (client: Discord.Client, storage: templates.bot_storage, ...args: any): Promise<void> => {
    // Args
    const message: Discord.Message = args[0];

    // The embed
    const embed: Discord.EmbedBuilder = new Discord.EmbedBuilder();
    embed.setColor(_config.defaults.color as Discord.ColorResolvable);
    embed.setAuthor({name: (message.author.username + "#" + message.author.discriminator), iconURL: message.author.avatarURL() as string});
    embed.setTimestamp();
    embed.setFooter({text: `$${config.name}`, iconURL: client?.user?.displayAvatarURL()});

    message.channel.send({embeds: [embed]});
}

/**
 * The event's config.
 */
export const config: templates.event_config = {
    name: "mention",
    noload: false
}
