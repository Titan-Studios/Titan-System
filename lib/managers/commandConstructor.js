const Discord = require('discord.js');

class CommandConstructor {
    /**
     * @param {string} name 
     * @param {string[]} aliases 
     */
    constructor(name, aliases) {
        this.name = name;
        this.aliases = aliases.map(alias => alias.toLowerCase());
    }
    /**
     * @param {string} prefix
     * @param {string} command
     * @param {string[]} args
     * @param {Discord.Message} message
     */
    handle(prefix, command, args, message) { }
}

module.exports = CommandConstructor;