const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Module = require('../../utils/modules');
const Main = require('../../../index');

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Loop command', ['loop', 'repeat']);
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
                description: 'Theres no song in the queue.',
                color: Colors.RED
            })]
        });
        if (!args[0]) return message.channel.send(`\`${prefix + command} <queue|song|off>\``);
        if (['queue', 'que', 'q', 'stop', 'off', 'reset', 'song'].includes(!args[0].toLowerCase())) return message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'Thats not a valid loop command!',
                color: Colors.RED
            })]
        });
        let modeNum = [];
        let modeMsg = [];
        if (['queue', 'que', 'q'].includes(args[0].toLowerCase())) {
            modeNum = '2';
            modeMsg = 'Looping Queue!';
        } else if (args[0].toLowerCase() === 'song') {
            modeNum = '1';
            modeMsg = 'Looping Song!';
        } else if (['stop', 'off', 'reset'].includes(args[0].toLowerCase())) {
            modeNum = '0';
            modeMsg = 'Looping Stopped!';
        }
        Main.getDistubeClient().setRepeatMode(message, parseInt(modeNum));
        message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: modeMsg,
                color: Colors.MINT
            })]
        });

    }
});