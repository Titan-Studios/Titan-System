const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Main = require('../../../index');
const Modules = require('../../utils/modules');

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Help command', ['creator', 'artist', 'contentcreator']);
    }
    /**
     * @param {string} prefix
     * @param {string} command
     * @param {string[]} args
     * @param {Discord.Message} message
     */
    handle(prefix, command, args, message) {

        message.react('749843034753204294').catch(error => Modules.errorLog(error, 'creator.js', 1));

        const questions = [
            'What Name Do You Go By?',
            'What Do You Do?',
            'Do you have a social? if so link them please'
        ];

        let collectCount = 0;
        let endCount = 0;

        if (message.author.bot) return;
        
        const filter = m => m.author.id === message.author.id;

        message.author.send({content: 'Starting Application'}).catch(error => Modules.errorLog(error, 'creator.js', 2));
        message.author.send({content: questions[collectCount++]}).then((start) => {
            const channel = start.channel;
            const appchannel = Main.getClient().channels.cache.get('767406744716181504');

            const collector = channel.createMessageCollector(filter);

            collector.on('collect', (i) => {
                if (collectCount < questions.length) {
                    channel.send({content: questions[collectCount++]}).catch(error => Modules.errorLog(error, 'creator.js', 3));
                } else {
                    collector.stop('Completed');
                    channel.send({content:'Thankies! Your creator application has been sent!'}).catch(error => Modules.errorLog(error, 'creator.js', 4));
                }
            });
            collector.on('end', (collected, reason) => {
                if (reason === 'Completed') {
                    const embed = new Discord.MessageEmbed({
                        title: 'Content Creator Application',
                        footer: {
                            text: `From: ${message.author.tag} ID: ${message.author.id}`,
                        },
                        thumbnail: {
                            url: message.author.displayAvatarURL({ size: 1024, dynamic: true})
                        },
                        timestamp: message.author.createdTimestamp
                    });
                    
                    collected.map((msg) => {
                        return embed.addField('>>> ' + questions[endCount++], msg.content);
                    });

                    appchannel.send({embeds: [embed]}).catch(error => Modules.errorLog(error, 'creator.js', 5));;
                } else {
                    channel.send({content: 'There was an error'}).catch(error => Modules.errorLog(error, 'creator.js', 6));;
                }
            })
        }).catch(error => Modules.errorLog(error, 'creator.js', 7));

    }
});