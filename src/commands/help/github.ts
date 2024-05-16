// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";

// Dependencies
import * as templates from "../../config/templates";
import * as helper from "../../helper_functions"

// Configs
import _config from "../../config/config.json";
import __config from "../../config/__config.json";

/**
 * The main function that will run the command
 * @param client Discord client
 * @param message The last message that invoked this command
 * @param args All the remaining arguments
 */
export const run: templates.command_function = async (client: Discord.Client, message: Discord.Message, storage: templates.bot_storage, args: string[]): Promise<void> => {
    // Embed
    const embed: Discord.EmbedBuilder = new Discord.EmbedBuilder();
    embed.setColor(_config.defaults.color as Discord.ColorResolvable);
    embed.setAuthor({name: (message.author.username + "#" + message.author.discriminator), iconURL: message.author.avatarURL() as string});
    embed.setTimestamp();
    embed.setFooter({text: `$${config.name}`, iconURL: client?.user?.displayAvatarURL()});
    embed.setTitle("Github");
    embed.setURL("https://github.com/glebiystudent/nodeproject");
    embed.setDescription("```Repository link```");

    message.channel.send({embeds: [embed]}).then((): void => {
        helper.correct(message);
    });
}

/**
 * Command's config.
 */
export const config: templates.command_config = {
    name: "github",
    aliases: ["gh", "repository"],
    description: "Sends an embed that contains the link to the github repository of this bot.",
    args: [],
    mod: "Help"
}
