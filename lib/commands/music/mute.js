const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Module = require('../../utils/modules');
const Main = require('../../../index');

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Mute command', ['mute', 'unmute']);
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

        if (message.member.voice.channel.id !== message.guild.me.voice.channel.id) return message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'Hmm you should join the voice channel im in first.',
                color: Colors.RED
            })]
        });
        let queue = Main.getDistubeClient().getQueue(message);
        if (!queue) return message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'Theres no song in the queue',
                color: Colors.RED
            })]
        });
        switch(command) {
            case 'unmute':
                if (message.guild.me.voice.mute) {
                    message.guild.me.voice.setMute(false).then(() => {
                        message.channel.send({
                            embeds: [new Discord.MessageEmbed({
                                description: 'Unmuted',
                                color: Colors.MINT
                            })]
                        });
                    });
                } else {
                    message.channel.send({
                        embeds: [new Discord.MessageEmbed({
                            description: 'Im not muted',
                            color: Colors.RED
                        })]
                    });
                }
                break;
            case 'mute':
                if (!message.guild.me.voice.mute) {
                    message.guild.me.voice.setMute(true).then(() => {
                        message.channel.send({
                            embeds: [new Discord.MessageEmbed({
                                description: 'Muted',
                                color: Colors.MINT
                            })]
                        });
                    });
                } else {
                    message.channel.send({
                        embeds: [new Discord.MessageEmbed({
                            description: 'Im already muted',
                            color: Colors.RED
                        })]
                    });
                }
                break;
        }

    }
});