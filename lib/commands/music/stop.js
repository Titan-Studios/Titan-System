const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Module = require('../../utils/modules');
const Main = require('../../../index');

const songGenres = [
    'Lofi',
    'Pop',
    'Hiphop',
    'Hits Radio 1',
    'House',
    'Chill'
]

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Stop command', ['stop', 'leave', 'shut', 'stfu']);
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
                description: 'Im already not playing!',
                color: Colors.RED
            })]
        });
        Main.getDistubeClient().stop(message).catch(() => {});
        message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'Okie bean uwu',
                color: Colors.MINT
            })]
        });
        if (!message.member.roles.cache.find(role => role.name.toLowerCase() === 'dj') || !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return Main.getDistubeClient().playVoiceChannel(Main.getClient().channels.cache.get('708843720019017751'), Utils.randomElement(songGenres) + ' Live Music Radio', {textChannel: Main.getClient().channels.cache.get('717400629043134526')});
    }
});