const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Module = require('../../utils/modules');
const Main = require('../../../index');

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Skip command', ['skip', 's', 'prev', 'previous']);
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

        switch(command) {
            case 's':
            case 'skip':
                if (!queue) {
                    return message.channel.send({
                        embeds: [new Discord.MessageEmbed({
                            description: 'Theres no queue.',
                            color: Colors.RED
                        })]
                    });
                }
                if (queue && queue.songs.length < 2) return message.channel.send({
                    embeds: [new Discord.MessageEmbed({
                        description: 'Theres no song to skip to.',
                        color: Colors.RED
                    })]
                });
                Main.getDistubeClient().skip(message).catch(() => {});
                message.channel.send({
                    embeds: [new Discord.MessageEmbed({
                        description: 'Skipping Song!',
                        color: Colors.MINT
                    })]
                });
                break;
            case 'prev':
            case 'previous':
                if (queue && queue.previousSongs.length < 2) return message.channel.send({
                    embeds: [new Discord.MessageEmbed({
                        description: 'Theres no song to skip back to.',
                        color: Colors.RED
                    })]
                });
                Main.getDistubeClient().previous(message).catch(() => {});
                message.channel.send({
                    embeds: [new Discord.MessageEmbed({
                        description: 'Skipping back to previous Song!',
                        color: Colors.MINT
                    })]
                });
                break;
        }

    }
});