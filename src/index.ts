// Setup
// Importing all the dependencies
import * as Discord from "discord.js";
import * as fs from "fs";

// Configuration files
import config from "./config/config.json";
import __config from "./config/__config.json";

import * as helper from "./helper_functions";
import * as templates from "./config/templates";

// Initializing the client
const intents : Discord.GatewayIntentBits[] = [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMembers
];

const client: Discord.Client = new Discord.Client({intents: intents});

// Bot storage  
const storage: templates.bot_storage = {
    commands : new Map<string[], templates.command>(),
    events : new Map<string, templates.event>()
};



// --- ===== --- Helper functions --- ===== --- \\ 

/**
 * Reads the files in the specified path and calls a function on each and every path.
 * @param path The path
 * @param callback_fn The function that will be called on every path. Must take a string argument.
 */
const read_files = (path: string, callback_fn: (arg0: string) => void): void => {
    fs.readdirSync(path).forEach((new_path: string): void => {
        callback_fn(new_path);
    });
}

/**
 * Helper function that helps handling events.
 * @param event_name The event name that is displayed in the event config
 * @param args All the arguments that will be passed to the event function
 */
const handle_event = (event_name: string, ...args: any): void => {
    storage.events.get(event_name)?.run(client, storage, ...args);
};


// Storing all the commands
console.log("\n\n\n\n\n\n[INFO] --- Loading commands... ---");
read_files(`${__dirname}/commands/`, (command_folder: string): void => {
    if(!command_folder.includes("template")) { 
        read_files(`${__dirname}/commands/${command_folder}`, (command_file: string): void => {
            const cmd: templates.command = require(`${__dirname}/commands/${command_folder}/${command_file}`);
            storage.commands.set([cmd.config.name, ...cmd.config.aliases], cmd);
            console.log(`[INFO] ${command_file} command has been successfully loaded.`);
        });
    }   
})

// Storing all the events 
console.log("[INFO] --- Loading events... ---");
read_files(`${__dirname}/events`, (event_file: string): void => {
    if(!event_file.includes("template")) { 
        const event: templates.event = require(`${__dirname}/events/${event_file}`);
        if(!event.config.noload) {
            storage.events.set(event.config.name, event);
            console.log(`[INFO] ${event_file} event has been successfully loaded.`);
        }
    }
});


// --- ===== --- Events --- ===== --- \\ 
client.on(Discord.Events.ClientReady, (): void => {
    handle_event("ready");
});

client.on(Discord.Events.MessageCreate, (message): void => {
    handle_event("message", message, storage);
});

client.on(Discord.Events.MessageDelete, (message): void => {
    handle_event("messagedelete", message, storage);
});

client.on(Discord.Events.MessageUpdate, (message, newMessage): void => {
    handle_event("messageedit", message, newMessage, storage);
});

// Logging in the client
client.login(__config.token);