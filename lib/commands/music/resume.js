const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Module = require('../../utils/modules');
const Main = require('../../../index');

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Resume command', ['resume']);
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
        let isPlaying = Main.getDistubeClient().isPlaying(message);
        if (!queue) return message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'Theres no song in the queue to resume.',
                color: Colors.RED
            })]
        });
        if (isPlaying) return message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'The song is already playing.',
                color: Colors.RED
            })]
        });
        Main.getDistubeClient().resume(message);
        message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'Resuming Song!',
                color: Colors.MINT
            })]
        });

    }
});