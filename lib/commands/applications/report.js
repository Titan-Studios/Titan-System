const Discord = require('discord.js');
const CommandConstructor = require('../../managers/commandConstructor');
const Main = require('../../../index');

module.exports = new (class extends CommandConstructor {
    constructor() {
        super('Help command', ['report']);
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
            'What do you want to report to the staff team?',
            'Any other info?',
            'Please send links to images if any (make sure the links are all in one message)'
        ];

        let collectCount = 0;
        let endCount = 0;
        
        if (message.author.bot) return;
        
        const filter = m => m.author.id === message.author.id;

        message.author.send({content:'Starting Report'}).catch(() => {});
        message.author.send({content:questions[collectCount++]}).then((start) => {
            const channel = start.channel;
            const appchannel = Main.getClient().channels.cache.get('885240379425841162');

            const collector = channel.createMessageCollector({filter});

            collector.on('collect', (i) => {
                if (collectCount < questions.length) {
                    channel.send({content:questions[collectCount++]}).catch(() => {});
                } else {
                    collector.stop('Completed');
                    channel.send({content:'Thankies! Your report has been sent, Please wait as the team review it!'}).catch(() => {});
                }
            });
            collector.on('end', (collected, reason) => {
                if (reason === 'Completed') {
                    const embed = new Discord.MessageEmbed({
                        title: 'Report',
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