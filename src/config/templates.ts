// Libraries

import * as Discord from "discord.js";
import * as MySQL from "mysql";

// --- ===== --- Other interfaces --- ===== --- \\ 

/**
 * Storage interface
 */

export interface bot_storage {
    commands: Map<string[], command>,
    events: Map<string, event>
};

// --- ===== --- Config interfaces --- ===== --- \\ 

/**
 * Interface for the config inside each and every command.
 */
export interface command_config {
    readonly name: string,
    readonly aliases: string[],
    readonly description: string,
    readonly args: string[],
    readonly mod: string
};

/**
 * Interface for the config inside each and every event.
 */
export interface event_config {
    readonly name: string,
    readonly noload: boolean
};



// --- ===== --- Function interfaces --- ===== --- \\ 

export type event_function = (arg0: Discord.Client, arg1: bot_storage, ...args: any) => Promise<void>;
export type command_function = (arg0: Discord.Client, arg1: Discord.Message, arg2: bot_storage, arg3: string[]) => Promise<void>;



// --- ===== --- Main interfaces --- ===== --- \\ 

/**
 * Command interface.
 */
export interface command {
    readonly run: command_function,
    readonly config: command_config
};

/**
 * Event interface.
 */
export interface event {
    readonly run: event_function,
    readonly config: event_config
}