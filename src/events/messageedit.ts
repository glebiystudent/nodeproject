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
    const message: Discord.Message = args[0];
    const newmessage: Discord.Message = args[1];
    let channel = await helper.ensure_logs(message);

    // Embed
    const embed: Discord.EmbedBuilder = new Discord.EmbedBuilder();
    embed.setColor(_config.defaults.editcolor as Discord.ColorResolvable);
    embed.setTitle("Edited message!");
    embed.setAuthor({name: (message.author.username + "#" + message.author.discriminator), iconURL: message.author.avatarURL() as string});
    embed.setTimestamp();
    embed.setFooter({text: `$${config.name}`, iconURL: client?.user?.displayAvatarURL()});
    embed.addFields(
        { name: "Previous", value: message.content},
        { name: "New", value: newmessage.content}
    )

    channel?.send({embeds: [embed]}).then((): void => {

    });
}

/**
 * The event's config.
 */
export const config: templates.event_config = {
    name: "messageedit",
    noload: false
}

