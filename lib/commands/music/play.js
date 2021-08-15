const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Module = require('../../utils/modules');
const Main = require('../../../index');

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Play command', ['play', 'p']);
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
        if (!args[0] && queue !== undefined) {
            if (queue.paused){
            Main.getDistubeClient().resume(message);
            message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    description: 'Resuming Song!',
                    color: Colors.MINT
                })]
            });
            return;}
        }
        if (!args[0]) {
            message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    description: `\`${prefix + command} <link|name>\``,
                    color: Colors.RED
                })]
            });
            return;
        }
        Main.getDistubeClient().play(message, args.join(' '));
    }
});