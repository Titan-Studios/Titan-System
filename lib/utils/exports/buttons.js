const Discord = require('discord.js');
const Colors = require('../colors');
const Main = require('../../../index');
const Dev = require('../../../data/dev.json');

const songGenres = [
    'Lofi',
    'Pop',
    'Hiphop',
    'Hits Radio 1',
    'House',
    'Chill'
]

let deleteButton = new Discord.MessageButton()
    .setStyle('DANGER')
    .setLabel('Delete')
    .setCustomId('Delete')



/**
 * @param {Discord.Client} client
 * @returns {Promise<void>}
 */
 const handleButtonClick = client => {
    client.on('interactionCreate', button => {
        if (button.user.id === button.user.id) {
            if (button.customId === 'JoinServer') {
                button.defer({
                    ephemeral: true
                }).then(() => {
                    button.editReply({
                        content: Dev.serverInvite
                    });
                });
            }
            if (button.customId === 'InviteBot') {
                button.defer({
                    ephemeral: true
                }).then(() => {
                    button.editReply({
                        content: 'Not Yet Bean Im Beta'
                    });
                });
            }
            if (button.customId === 'BotWebsite') {
                button.defer({
                    ephemeral: true
                }).then(() => {
                    button.editReply({
                        content: 'Not Yet Bean UwU'
                    });
                });
            }
            if (button.customId === 'Website') {
                button.defer({
                    ephemeral: true
                }).then(() => {
                    button.editReply({
                        content: Dev.websiteLink
                    });
                });
            }
            if (button.customId === 'Premium') {
                button.defer({
                    ephemeral: true
                }).then(() => {
                    button.editReply({
                        content: Dev.websiteLink + 'membership'
                    });
                });
            }
            if (button.customId === 'Topgg') {
                button.defer({
                    ephemeral: true
                }).then(() => {
                    button.editReply({
                        content: Dev.topggLink
                    });
                });
            }
            if (button.customId === 'Donate') {
                button.defer({
                    ephemeral: true
                }).then(() => {
                    button.editReply({
                        content: Dev.donate
                    });
                });
            }
            if (button.customId === 'Merch') {
                button.defer({
                    ephemeral: true
                }).then(() => {
                    button.editReply({
                        content: Dev.websiteLink + 'merch'
                    });
                });
            }
            if (button.customId === 'Twitter') {
                button.defer({
                    ephemeral: true
                }).then(() => {
                    button.editReply({
                        content: Dev.websiteLink + 'goto/twitter'
                    });
                });
            }
            if (button.customId === 'Youtube') {
                button.defer({
                    ephemeral: true
                }).then(() => {
                    button.editReply({
                        content: Dev.websiteLink + 'goto/youtube'
                    });
                });
            }
            if (button.customId === 'Ver') {
                button.defer({
                    ephemeral: true
                }).then(() => {
                    button.editReply({
                        content: `**Latest Version:** \`${client.bot.version}\``
                    });
                });
            }
        }
        if (['Next', 'Back', 'Continue', 'Decline', 'Skip', 'Shuffle', 'Stop', 'Delete'].includes(button.customId)) {
            button.deferUpdate();
        }
    });
};

/**
 * @param {Discord.Message} message
 * @param {Number} time
 * @param {Array} msg1
 * @param {Array} msg2
 * @param {Array} msg3
 * @param {Array} msg4
 * @param {Object} first
 * @returns {Promise<void>}
 */
const handleMessageButton = async (message, embed, msg1, msg2, msg3, msg4, time = 60000, defer = true) => {

    let btn1;
    let btn2;
    let btn3;
    let btn4;

    let buttons = [];

    if (msg1) {
        btn1 = new Discord.MessageButton()
            .setStyle(msg1[1])
            .setLabel(msg1[0])
            .setCustomId('1')
        buttons.push(btn1);
    }
    if (msg2) {
        btn2 = new Discord.MessageButton()
            .setStyle(msg2[1])
            .setLabel(msg2[0])
            .setCustomId('2')
        buttons.push(btn2);
    }
    if (msg3) {
        btn3 = new Discord.MessageButton()
            .setStyle(msg3[1])
            .setLabel(msg3[0])
            .setCustomId('3')
        buttons.push(btn3);
    }
    if (msg4) {
        btn4 = new Discord.MessageButton()
            .setStyle(msg4[1])
            .setLabel(msg4[0])
            .setCustomId('4')
        buttons.push(btn4);
    }

    buttons.push(deleteButton);

    message.reply({
        allowedMentions: {
            repliedUser: false
        },
        components: [
            new Discord.MessageActionRow({
                components: buttons,
            })
        ],
        embeds: [embed]
    }).then(async msg => {

        const filter = (button) => button.user.id === button.user.id;
        const collector = await msg.createMessageComponentCollector({
            filter,
            time: time
        });

        collector.on('collect', button => {

            if (message.author.id === button.user.id && button.customId === 'Delete') {
                collector.stop();
                msg.edit({
                    content: '`Message Deleted`',
                    embeds: [],
                    components: [],
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            }

            if (msg1 && button.customId === '1') {
                button.defer({
                    ephemeral: defer
                }).then(() => {
                    button.editReply({
                        content: msg1[2]
                    });
                });
            }
            if (msg2 && button.customId === '2') {
                button.defer({
                    ephemeral: defer
                }).then(() => {
                    button.editReply({
                        content: msg2[2]
                    });
                });
            }
            if (msg3 && button.customId === '3') {
                button.defer({
                    ephemeral: defer
                }).then(() => {
                    button.editReply({
                        content: msg3[2]
                    });
                });
            }
            if (msg4 && button.customId === '4') {
                button.defer({
                    ephemeral: defer
                }).then(() => {
                    button.editReply({
                        content: msg4[2]
                    });
                });
            }
        });
        collector.on('end', () => {
            if (!msg) return;
            if (msg && msg.embeds.length === 0) return;
            msg.edit({
                components: [],
                embeds: [embed.setAuthor('Interaction Closed')]
            })
        });
    });

};

/**
 * @param {Discord.Message} message
 * @param {Number} time
 * @param {Array} pages
 * @returns {Promise<void>}
 */
const handlePages = async (message, pages, time = 60000) => {

    let btn1 = new Discord.MessageButton()
        .setStyle('DANGER')
        .setLabel('Back')
        .setCustomId('Back')
    let btn2 = new Discord.MessageButton()
        .setStyle('SUCCESS')
        .setLabel('Next')
        .setCustomId('Next')

    if (pages.length === 1) {
        btn1.setDisabled(true);
        btn2.setDisabled(true);
    }


    message.reply({
        allowedMentions: {
            repliedUser: false
        },
        components: [
            new Discord.MessageActionRow({
                components: [btn1, btn2, deleteButton],
            })
        ],
        embeds: [pages[0].setAuthor(`Page 1 / ${pages.length}`)]
    }).then(async msg => {

        let i = 0;

        const filter = (button) => button.user.id === message.author.id;
        const collector = await msg.createMessageComponentCollector({
            filter,
            time: time
        });

        collector.on('collect', button => {
            if (button.customId === 'Back') {
                if (i === 0) i = pages.length;
                i--;
                msg.edit({
                    components: [
                        new Discord.MessageActionRow({
                            components: [btn1, btn2, deleteButton],
                        })
                    ],
                    embeds: [pages[i].setAuthor(`Page ${i + 1} / ${pages.length}`)]
                });
                collector.resetTimer();
            }

            if (button.customId === 'Next') {
                if (i === pages.length - 1) i = -1;
                i++;
                msg.edit({
                    components: [
                        new Discord.MessageActionRow({
                            components: [btn1, btn2, deleteButton],
                        })
                    ],
                    embeds: [pages[i].setAuthor(`Page ${i + 1} / ${pages.length}`)]
                });
                collector.resetTimer();
            }

            if (button.customId === 'Delete') {
                collector.stop();
                msg.edit({
                    content: '`Message Deleted`',
                    embeds: [],
                    components: [],
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            }
        });
        collector.on('end', () => {
            if (!msg) return;
            if (msg && msg.embeds.length === 0) return;

            btn1.setDisabled(true);
            btn2.setDisabled(true);

            msg.edit({
                components: [],
                embeds: [pages[i].setAuthor(`Interaction Closed`)]
            });

        })


    });
};

/**
 * @param {Discord.Message} message
 * @param {Number} time
 * @param {Function} accept
 * @param {Discord.MessageEmbed} embed
 * @param {Array} buttonName
 * @returns {Promise<void>}
 */
const handleVerify = async (message, embed, accept, time = 60000, userID = message.author.id, buttonName = ['Continue', 'Decline']) => {

    let btn1 = new Discord.MessageButton()
        .setStyle('DANGER')
        .setLabel(buttonName[1])
        .setCustomId('Decline')

    let btn2 = new Discord.MessageButton()
        .setStyle('SUCCESS')
        .setLabel(buttonName[0])
        .setCustomId('Continue')

    message.reply({
        allowedMentions: {
            repliedUser: false
        },
        components: [
            new Discord.MessageActionRow({
                components: [btn1, btn2, deleteButton],
            })
        ],
        embeds: [embed]
    }).then(async msg => {

        const filter = (button) => button.user.id === userID;
        const collector = await msg.createMessageComponentCollector({
            filter,
            time: time
        });

        btn1.setDisabled(true);
        btn2.setDisabled(true);

        collector.on('collect', button => {

            if (button.customId === 'Decline') {
                msg.edit({
                    components: [
                        new Discord.MessageActionRow({
                            components: [btn1, btn2, deleteButton],
                        })
                    ],
                    embeds: [embed.setAuthor('Declined')]
                });
                collector.stop();
            }

            if (button.customId === 'Continue') {
                msg.edit({
                    components: [
                        new Discord.MessageActionRow({
                            components: [btn1, btn2, deleteButton],
                        })
                    ],
                    embeds: [embed.setAuthor('Continued')]
                });
                accept(btn1, btn2);
                collector.resetTimer();
            }

            if (button.customId === 'Delete') {
                collector.stop();
                msg.edit({
                    content: '`Message Deleted`',
                    embeds: [],
                    components: [],
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            }
        });
        collector.on('end', () => {
            if (!msg) return;
            if (msg && msg.embeds.length === 0) return;

            msg.edit({
                components: [],
                embeds: [embed.setAuthor('Interaction Closed')]
            })
        });
    });

};

/**
 * @param {Discord.Message} message
 * @param {Number} time
 * @param {Array} pages
 * @returns {Promise<void>}
 */
const handleQueue = async (message, pages, time = 60000) => {

    let btn1 = new Discord.MessageButton()
        .setStyle('DANGER')
        .setLabel('Back')
        .setCustomId('Back')
    let btn2 = new Discord.MessageButton()
        .setStyle('SUCCESS')
        .setLabel('Next')
        .setCustomId('Next')
    let btn3 = new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setLabel('Skip')
        .setCustomId('Skip')
    let btn4 = new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setLabel('Shuffle')
        .setCustomId('Shuffle')
    let btn5 = new Discord.MessageButton()
        .setStyle('PRIMARY')
        .setLabel('Radio')
        .setCustomId('Radio')
    let btn6 = new Discord.MessageButton()
        .setStyle('DANGER')
        .setLabel('Stop')
        .setCustomId('Stop')

    if (pages.length === 1) {
        btn1.setDisabled(true);
        btn2.setDisabled(true);
    }

    let queue1 = Main.getDistubeClient().getQueue(message);
    if (queue1.songs.length === 1) {
        btn3.setDisabled(true);
    }



    message.reply({
        allowedMentions: {
            repliedUser: false
        },
        components: [
            new Discord.MessageActionRow({
                components: [btn1, btn2, deleteButton],
            }), new Discord.MessageActionRow({
                components: [btn3, btn4, btn5, btn6],
            })
        ],
        embeds: [pages[0].setAuthor(`Page 1 / ${pages.length}`)]
    }).then(async msg => {

        i = 0;

        const filter = (button) => button.user.id === message.author.id;
        const collector = await msg.createMessageComponentCollector({
            filter,
            time: time
        });

        collector.on('collect', button => {
            if (button.customId === 'Delete') {
                collector.stop();
                msg.edit({
                    content: '`Message Deleted`',
                    embeds: [],
                    components: [],
                    allowedMentions: {
                        repliedUser: false
                    }
                });
            }

            if (button.customId === 'Back') {
                if (i === 0) i = pages.length;
                i--;
                msg.edit({
                    components: [
                        new Discord.MessageActionRow({
                            components: [btn1, btn2, deleteButton],
                        }), new Discord.MessageActionRow({
                            components: [btn3, btn4, btn5, btn6],
                        })
                    ],
                    embeds: [pages[i].setAuthor(`Page ${i + 1} / ${pages.length}`)]
                });
                collector.resetTimer();
            }

            if (button.customId === 'Next') {
                if (i === pages.length - 1) i = -1;
                i++;
                msg.edit({
                    components: [
                        new Discord.MessageActionRow({
                            components: [btn1, btn2, deleteButton],
                        }), new Discord.MessageActionRow({
                            components: [btn3, btn4, btn5, btn6],
                        })
                    ],
                    embeds: [pages[i].setAuthor(`Page ${i + 1} / ${pages.length}`)]
                });
                collector.resetTimer();
            }

            if (button.customId === 'Skip') {
                Main.getDistubeClient().skip(message);
                collector.resetTimer();
            }

            if (button.customId === 'Shuffle') {
                Main.getDistubeClient().shuffle(message);
                collector.resetTimer();
            }

            if (button.customId === 'Stop') {
                Main.getDistubeClient().stop(message);
                msg.edit({
                    components: []
                });
                Main.getDistubeClient().playVoiceChannel(Main.getClient().channels.cache.get('708843720019017751'), Utils.randomElement(songGenres) + ' Live Music Radio', {textChannel: Main.getClient().channels.cache.get('717400629043134526')});
            }
            
            if (button.customId === 'Radio') {
                Main.getDistubeClient().stop(message);
                msg.edit({
                    components: []
                });
                Main.getDistubeClient().playVoiceChannel(Main.getClient().channels.cache.get('708843720019017751'), Utils.randomElement(songGenres) + ' Live Music Radio', {textChannel: Main.getClient().channels.cache.get('717400629043134526')});
            }
        });
        collector.on('end', () => {
            if (!msg) return;
            if (msg && msg.embeds.length === 0) return;
            msg.edit({
                components: [],
                embeds: [pages[i].setAuthor(`Interaction Closed`)]
            });
            collector.resetTimer();
        })


    });

};

module.exports.handleButtonClick = handleButtonClick;
module.exports.handleMessageButton = handleMessageButton;
module.exports.handlePages = handlePages;
module.exports.handleVerify = handleVerify;
module.exports.handleQueue = handleQueue;