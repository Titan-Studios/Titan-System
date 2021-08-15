const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Module = require('../../utils/modules');
const Main = require('../../../index');

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Clear queue command', ['clearque', 'clearqueue', 'clearq']);
    }
    /**
     * @param {string} prefix
     * @param {string} command
     * @param {string[]} args
     * @param {Discord.Message} message
     */
    handle(prefix, command, args, message) {

        if (!message.member.voice.channel) return message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'Hmm you should join the voice channel first.',
                color: Colors.RED
            })]
        });
        let queue = Main.getDistubeClient().getQueue(message);
        if (!queue) return message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'The queue is already empty',
                color: Colors.RED
            })]
        });
        queue.delete();
        message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'Okieee cleared!',
                color: Colors.MINT
            })]
        });

    }
});