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
    // Obtaining the member
    let member: (Discord.GuildMember | null) = await helper.find_member(message, args[0]) || message.member;
    
    
    // Embed
    const embed: Discord.EmbedBuilder = new Discord.EmbedBuilder();
    embed.setColor(_config.defaults.color as Discord.ColorResolvable);
    embed.setAuthor({name: (message.author.username + "#" + message.author.discriminator), iconURL: message.author.avatarURL() as string});
    embed.setTimestamp();
    embed.setFooter({text: `$${config.name}`, iconURL: client?.user?.displayAvatarURL()});
    embed.setDescription(`\`\`\`${member?.displayName}#${member?.user.discriminator}\`\`\``);
    embed.setImage(member?.user.avatarURL() as string);

    message.channel.send({embeds: [embed]}).then((): void => {
        helper.correct(message);
    });
}

/**
 * Command's config.
 */
export const config: templates.command_config = {
    name: "avatar",
    aliases: ["av"],
    description: "Sends an embed that contains your or specified member profile picture.",
    args: ["[member]"],
    mod: "Informative"
}
