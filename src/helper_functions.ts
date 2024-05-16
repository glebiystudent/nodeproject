// Dependencies
import * as MySQL from "mysql";
import * as Discord from "discord.js";

// Config
import * as config from "./config/config.json";
import * as __config from "./config/__config.json";

type confirmation_fn_t = (arg0?: Discord.Message) => void;

export const await_confirmation = async (message: Discord.Message, embed: Discord.Embed, confirm_fn: confirmation_fn_t, reject_fn?: confirmation_fn_t) => {
    message.channel.send({embeds: [embed]}).then(async embed_message => {
        await embed_message.react(config.emojis.correct);
        await embed_message.react(config.emojis.wrong);

        embed_message.awaitReactions({ max: 1, time: 60_000, errors: ['time'] })
        .then(collected => {
            const emoji_name = collected.first()?.emoji.name;

            switch(emoji_name) {
                case config.emojis.correct:
                    confirm_fn(embed_message);
                    break;
                case config.emojis.wrong:
                    message.react(config.emojis.wrong);

                    break;
            }
        }).catch(_collected => {
            message.react(config.emojis.wrong);
            reject_fn?.(embed_message);
        });
    });
};

export const get_flags = (args: string[]): string[] => {
    return args.filter(arg => arg.startsWith('-'));
}

export const find_member = async (message: Discord.Message, subject: string): Promise<Discord.GuildMember | undefined> => {
    if(subject?.startsWith("<@!") && subject?.endsWith('>'))
        return message.guild?.members.cache?.get(subject?.substring(3, subject?.length - 4));
    else if((subject?.length == 18 || subject?.length == 17) && !isNaN(parseInt(subject)))
        return message.guild?.members.cache.get(subject);
    else
        return ((await message.guild?.members.fetch())?.filter(m => { return m.displayName?.toLowerCase()?.includes(subject?.toLowerCase()) || m.user.username.toLowerCase().includes(subject?.toLowerCase()); } ))?.first();
}


export const ensure_logs = async (message: Discord.Message): Promise<Discord.GuildTextBasedChannel | undefined> => {
    if(message.guild == undefined)
        return undefined;

    let channels = await message.guild?.channels.fetch();
    if(!channels)
        return;

    let logschannel: any;

    let found = false;
    channels.forEach((channel) => {
        if(channel?.name == "logs" && channel?.parent?.name == "admin") {
            found = true;
            logschannel = channel;
        }
    });

    if(!found) {
        const __channel = await message.guild?.channels.create({name: "logs"});
        const __category = await message.guild?.channels.create({name: "admin", type: Discord.ChannelType.GuildCategory});
        __channel.setParent(__category.id);
        logschannel = __channel;
    }

    return logschannel;
}

export const timeout = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Checks whether the member has the specified permission.
 * @param member The guild's member
 * @param permission The permission. Defaults to ADMINISTRATOR
 * @returns Whether the member has the specified permission
 */
export const has_administrator = (member: Discord.GuildMember | null, permission: Discord.PermissionsBitField): boolean | undefined => {
    return member?.permissions.has(Discord.PermissionsBitField.Flags.Administrator, true);
};

/**
 * Reacts to the message with a wrong emoji.
 * @param message A Discord message object.
 */
export const wrong = async (message: Discord.Message): Promise<void> => {
    message.react(config.emojis.wrong);
}

/**
 * Reacts to the message with a correct emoji.
 * @param message A Discord message object.
 */
export const correct = async (message: Discord.Message): Promise<void> => {
    message.react(config.emojis.correct);
}


/**
 * A type for callback functions in the forEach function.
 */
export type func_t<T, T_> = (arg0: T, arg1: T_) => void;

/**
 * Iterates a map with a key first and then value.
 * @param map The map to iterate through
 * @param callback The callback function that is gonna be called on each iteration
 */
export const forEach = <T, T_>(map: Map<T, T_>, callback: func_t<T, T_>): void => {
    map.forEach((val: T_, key: T): void => {
        callback(key, val);
    });
}

export const find_first_matching = (values: string[], value: string): string => {
    for(let i = 0; i < values.length; ++i)
        if(values[i].toLowerCase().indexOf(value.toLowerCase()) != -1)    
            return values[i];       
    return "";
}