const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Module = require('../../utils/modules');
const Main = require('../../../index');

module.exports = new(class extends CommandConstructor {
    constructor() {
        super('Volume command', ['volume', 'vol']);
    }
    /**
     * @param {string} prefix
     * @param {string} command
     * @param {string[]} args
     * @param {Discord.Message} message
     */
    handle(prefix, command, args, message) {

        if (args[0]) args[0] = args[0].replace('%', '');
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

        args[0] = parseInt(args[0]);

        if (isNaN(args[0])) return message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: `You didnt mention a number!\nCurrent volume: \`${queue.volume}%\``,
                color: Colors.MINT
            })]
        });


        if (args[0] > 100) {
            if (!message.member.roles.cache.find(role => role.name.toLowerCase() === 'dj') || !message.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    description: 'You need the DJ role or Admin perm to put the volume above \`150%\` ',
                    color: Colors.RED
                })]
            });
            if (args[0] > 50000) {
                message.channel.send({
                    embeds: [new Discord.MessageEmbed({
                        color: Colors.RED,
                        description: 'You cant set the volume above `50,000%`'
                    })]
                });
                return;
            }
            if (args[0] > 250) {

                let embed = new Discord.MessageEmbed({
                    description: '⚠ Warning! ⚠\nThis may cause intense earrape are you sure you want to continue?!',
                    color: Colors.RED
                });

                const accept = () => {
                    message.channel.send({
                        embeds: [new Discord.MessageEmbed({
                            description: `The volume is now \`${args[0].toLocaleString()}%\``,
                            color: Colors.MINT
                        })]
                    });
                    Main.getDistubeClient().setVolume(message, args[0]);
                }

                Module.verify(message, embed, accept);

            } else {
                message.channel.send({
                    embeds: [new Discord.MessageEmbed({
                        description: `The volume is now \`${args[0]}%\``,
                        color: Colors.MINT
                    })]
                });
                Main.getDistubeClient().setVolume(message, args[0]);
            }

        } else {
            message.channel.send({
                embeds: [new Discord.MessageEmbed({
                    description: `The volume is now \`${args[0]}%\``,
                    color: Colors.MINT
                })]
            });
            Main.getDistubeClient().setVolume(message, args[0]);
        }

    }
});