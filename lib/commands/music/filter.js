const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Module = require('../../utils/modules');
const Main = require('../../../index');
let filters;

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Filter command', ['filter', 'filt']);
        setTimeout(() => {
            filters = [...Main.getDistubeFilters(), 'off']
        }, 100);
    }
    /**
     * @param {string} prefix
     * @param {string} command
     * @param {string[]} args
     * @param {Discord.Message} message
     */
    handle(prefix, command, args, message) {

        const user = message.guild.members.cache.get(message.author.id);
        if (!user.roles.cache.find(role => role.name.toLowerCase() === 'dj') || !user.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR)) return message.channel.send({
            embeds: [new Discord.MessageEmbed({
                description: 'You need the DJ DJ role or Admin perm to do that',
                color: Colors.RED
            })]
        });

                if (!message.member.voice.channel) return message.channel.send({
                    embeds: [new Discord.MessageEmbed({
                        description: 'Hmm you should join the voice channel first.',
                        color: Colors.RED
                    })]
                });

                let queue = Main.getDistubeClient().getQueue(message);

                if (!queue) {
                    message.channel.send({
                        embeds: [new Discord.MessageEmbed({
                            description: 'Theres no song in the queue to Filter.',
                            color: Colors.RED
                        })]
                    });
                    return;
                }

                if (!args[0]) {
                    message.channel.send({
                        embeds: [new Discord.MessageEmbed({
                            description: `Filters: \`${filters.join('`, `')}\``,
                            color: Colors.MINT
                        })]
                    });
                    return;
                }

                let newFilter = args[0].toLowerCase();

                if (!filters.includes(newFilter)) {
                    message.channel.send({
                        embeds: [new Discord.MessageEmbed({
                            description: `That filter does not exist, Filters: \`${filters.join('`, `')}\``,
                            color: Colors.RED
                        })]
                    });
                    return;
                }

                if (newFilter !== (queue.filter || 'off')) Main.getDistubeClient().setFilter(message, newFilter !== 'off' ? newFilter : queue.filter);

                message.channel.send({
                    embeds: [new Discord.MessageEmbed({
                        description: `Changed the filter to \`${Utils.firstUpperCase(newFilter)}\``,
                        color: Colors.MINT
                    })]
                });
    }
});