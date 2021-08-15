const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Colors = require('../../utils/colors');
const Utils = require('../../utils/utils');
const Module = require('../../utils/modules');
const Main = require('../../../index');

module.exports = new (class extends CommandConstructor {

    constructor() {
        super('Queue command', ['queue', 'que', 'q']);
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

        let loop = [];

        if (queue.repeatMode === 0) {
            loop = 'Off';
        } else if (queue.repeatMode === 1) {
            loop = 'Song';
        } else if (queue.repeatMode === 2) {
            loop = 'Queue';
        }

        const chunks = Utils.maxArrayLength(queue.songs, 10);

        let embeds = [];
        let i = 1;
        let embed;
        for (const chunk of chunks) {
            embed = new Discord.MessageEmbed({
                title: `Queue`,
                color: Colors.MINT,
                description: `${chunk.map((song) => `\`${i++}.\` ${Utils.shortMessage(song.name, 35)} \`${song.isLive ? 'Live 🔴' : song.formattedDuration}\` \`${song.user.tag}\` ${song.playing ? '`Now Playing`' : ''}`).join('\n')}`,
                fields: [{
                    name: 'Queue Settings',
                    value: `**Filter:** \`${Utils.firstUpperCase(queue.filters.join(' ') || 'Off')}\`\n**Autoplay:** \`${queue.autoplay ? 'On' : 'Off'}\`\n**Volume:** \`${queue.volume}%\``,
                    inline: true
                }, {
                    name: 'ㅤ',
                    value: `**Total Songs:** \`${queue.songs.length}\`\n**Duration:** \`${queue.formattedCurrentTime}\` of \`${queue.formattedDuration}\`\n**Looping:** \`${loop}\``,
                    inline: true
                }]
            });
            embeds.push(embed);
        }

        Module.queue(message, embeds);

    }
});