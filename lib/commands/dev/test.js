const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Module = require('../../utils/modules');
const Utils = require('../../utils/utils');
const Main = require('../../../index');
const Dev = require('../../../data/dev.json');

module.exports = new(class extends CommandConstructor {
    constructor() {
        super('Test command', ['test']);
    }
    /**
     * @param {string} prefix
     * @param {string} command
     * @param {string[]} args
     * @param {number} start
     * @param {Discord.Message} message
     */
    async handle(prefix, command, args, message, bot) {
        if (!Dev.ownerIDs.includes(message.author.id)) {
            message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    description: 'Sorry, Only my Devs can use this command',
                    color: Colors.RED
                })]
            });
            return;
        }
    }
});