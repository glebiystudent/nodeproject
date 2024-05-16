// Libraries
import * as Discord from "discord.js";
import * as MySQL from "mysql";
import * as https from "https";

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
    let data = "";
    https.get("https://api.currencyapi.com/v3/latest?apikey=cur_live_A5qJRrmisuMduphy82oJuOakXDitSWDxn7ohU7bw", r => {
        r.on('data', c => {
            data += c;
        });

        r.on('end', () => {
            const parsed = JSON.parse(data);

            const embed: Discord.EmbedBuilder = new Discord.EmbedBuilder();
            embed.setColor(_config.defaults.color as Discord.ColorResolvable);
            embed.setAuthor({name: (message.author.username + "#" + message.author.discriminator), iconURL: message.author.avatarURL() as string});
            embed.setTimestamp();
            embed.setFooter({text: `$${config.name}`, iconURL: client?.user?.displayAvatarURL()});
            embed.setTitle("Exchange Rates");
            embed.addFields(
                { name: "CAD", value: `${Math.round((parsed.data.CAD.value + Number.EPSILON) * 100) / 100}` },
                { name: "EUR", value: `${Math.round((parsed.data.EUR.value + Number.EPSILON) * 100) / 100}` },
                { name: "CHF", value: `${Math.round((parsed.data.CHF.value + Number.EPSILON) * 100) / 100}`},
                { name: "BTC", value: `${Math.round(1 / (parsed.data.BTC.value))}` }
            );
        
            message.channel.send({embeds: [embed]}).then((): void => {
                helper.correct(message);
            });
        });
    });
    
}

/**
 * Command's config.
 */
export const config: templates.command_config = {
    name: "exrates",
    aliases: ["exchangerates", "forex", "fx", "ex"],
    description: "Shows the most popular and used exchange rates.",
    args: [""],
    mod: "Informative"
}
