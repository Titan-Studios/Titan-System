const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Main = require('../../../index');

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Help command', ['staff', 'staffapp', 'mod']);
    }
    /**
     * @param {string} prefix
     * @param {string} command
     * @param {string[]} args
     * @param {Discord.Message} message
     */
    handle(prefix, command, args, message) {

        message.react('749843034753204294').catch(() => {});

        const questions = [
            'What is your name?',
            'How old are you?',
            'Why should we select you to be a staff?',
            'Have you ever been banned from a discord server, if yes why?',
            'How many servers have you owned or managed',
            'What will you help do in the community?'
        ];

        let collectCount = 0;
        let endCount = 0;
        
        if (message.author.bot) return;
        
        const filter = m => m.author.id === message.author.id;

        message.author.send({content:'Starting Staff Application'}).catch(() => {});
        message.author.send({content:questions[collectCount++]}).then((start) => {
            const channel = start.channel;
            const appchannel = Main.getClient().channels.cache.get('767406744716181504');

            const collector = channel.createMessageCollector({filter});

            collector.on('collect', (i) => {
                if (collectCount < questions.length) {
                    channel.send({content:questions[collectCount++]}).catch(() => {});
                } else {
                    collector.stop('Completed');
                    channel.send({content:'Thankies! Your staff application has been sent, Please wait as the team review it!'}).catch(() => {});
                }
            });
            collector.on('end', (collected, reason) => {
                if (reason === 'Completed') {
                    const embed = new Discord.MessageEmbed({
                        title: 'Staff Application',
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

                    appchannel.send({embeds:[embed]}).catch(() => {});
                } else {
                    channel.send({content:'There was an error'}).catch(() => {});
                }
            })
        }).catch(console.error());

    }
});