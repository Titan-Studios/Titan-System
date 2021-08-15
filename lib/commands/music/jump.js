const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Module = require('../../utils/modules');
const Main = require('../../../index');

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Jump command', ['jump', 'skipto']);
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
                description: 'Theres no song in the queue to jump to.',
                color: Colors.RED
            })]
        });
        if (Number.isNaN(+args[0])) return message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'That is not a number!',
                color: Colors.RED
            })]
        });
        if (args[0] > queue.songs.length) return message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'That number is not on the queue!',
                color: Colors.RED
            })]
        });
        message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: `Jumping to the ${Util.numberFormat(args[0])} song!`,
                color: Colors.MINT
            })]
        });
        Main.getDistubeClient().jump(message, parseInt(args[0] - 1));

    }
});