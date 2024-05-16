// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";

// Dependencies
import * as templates from "../../config/templates";
import * as helper from "../../helper_functions"

// Configs
import _config from "../../config/config.json";
import __config from "../../config/__config.json";

const concat = (parts: string[], prefix?: string): string => {
    let str: string = "";
    for(let i = 0; i < parts.length; ++i) {
        if(prefix)
            str += prefix;
        (i == parts.length - 1) ? str += parts[i] : str += parts[i] + ", ";
    } 
    return str;
};
/**
 * The main function that will run the command
 * @param client Discord client
 * @param message The last message that invoked this command
 * @param args All the remaining arguments
 */
export const run: templates.command_function = async (client: Discord.Client, message: Discord.Message, storage: templates.bot_storage, args: string[]): Promise<void> => {
    // Args
    const help_subject: string = args[0];


    // Embed
    const embed: Discord.EmbedBuilder = new Discord.EmbedBuilder();

    // Filling in all the commands. Module : commands
    const commands: Map<string, templates.command[]> = new Map<string, templates.command[]>();
    helper.forEach(storage.commands, (names, command) => {
        if(!commands.has(command.config.mod))
            commands.set(command.config.mod, []);
        commands.get(command.config.mod)?.push(command);
    });

    // Main help logic
    if(!help_subject) { // All modules
        // Shows all the modules and the amount of commands in them
        helper.forEach(commands, (mod: string, commands: templates.command[]): void => {
            embed.addFields({name: mod, value: `\`\`\`${commands.length}\`\`\``, inline: true});
        });
        embed.setTitle("All modules help");
    } else if(help_subject.length != 0 && !help_subject.startsWith("$")) { // Module-specific
        let description: string = "";

        // The module name which is deduced from the part of it
        const mod_name: string = helper.find_first_matching([...commands.keys()], help_subject);
        if(mod_name == "") // If module does not exist
            return;
        commands.get(mod_name)?.forEach((cmd: templates.command): void => {
            description += `$${cmd.config.name}{${concat(cmd.config.aliases, "$")}}\n`;
        });

        embed.setDescription("```" + description + "```");
        embed.setTitle(`${mod_name} module help`);
    } else { // Command-specific
        let description: string = "";

        // Filling in all the commands
        let commands: string[] = [];
        helper.forEach(storage.commands, (names: string[], cmd: templates.command): void => {
            commands.push(...names);
        });
        
        // The command name which is deduced from the part of it
        const cmd_name: string = helper.find_first_matching(commands, help_subject.substring(1));
        if(cmd_name == "") // If command does not exist
            return;

        // Finding the right command
        let cmd: templates.command | undefined = undefined;
        helper.forEach(storage.commands, (names: string[], cmd_: templates.command) => {
            if(names.includes(cmd_name))
                cmd = cmd_;
        });
        
        if(cmd) {
            const command: templates.command = cmd as templates.command;
            description += `$${command.config.name}{${concat(command.config.aliases, "$")}} ${concat(command.config.args)} - ${command.config.description}`;
            embed.setDescription("```" + description + "```");
            embed.setTitle(`${command.config.mod} | $${cmd_name} help`);
        }
    }


    embed.setColor(_config.defaults.color as Discord.ColorResolvable);
    embed.setAuthor({name: (message.author.username + "#" + message.author.discriminator), iconURL: message.author.avatarURL() as string});
    embed.setTimestamp();
    embed.setFooter({text: `$${config.name}`, iconURL: client?.user?.displayAvatarURL()});
    message.channel.send({embeds: [embed]}).then((): void => {
        helper.correct(message);
    });
}

/**
 * Command's config.
 */
export const config: templates.command_config = {
    name: "help",
    aliases: ["h"],
    description: "A command that can help with any module or command.",
    args: ["[$command/module]"],
    mod: "Help"
}
