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

module.exports = new(class extends CommandConstructor {
    constructor() {
        super('Radio command', ['radio']);
    }
    /**
     * @param {string} prefix
     * @param {string} command
     * @param {string[]} args
     * @param {Discord.Message} message
     */
    handle(prefix, command, args, message) {

        let queue = Main.getDistubeClient().getQueue(message);
        if (queue) {
            queue.delete();
            message.channel.send({embeds: [new Discord.MessageEmbed({description: 'Ending queue and playing radio', color: Colors.LIGHT_PURPLE})]});
        }
        Main.getDistubeClient().playVoiceChannel(Main.getClient().channels.cache.get('708843720019017751'), Utils.randomElement(songGenres) + ' Live Music Radio', {textChannel: Main.getClient().channels.cache.get('717400629043134526')});

    }
});