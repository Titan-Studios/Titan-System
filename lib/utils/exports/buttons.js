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
        if (button.customId === 'Verify') {
            button.deferUpdate();
            const member = button.member;
            const verified = member.roles.cache.get('739111886234320896');
            if (verified) {
                return member.send({
                    content: 'Beans you\'re already verified'
                })
            } else {
                const questions = [
                    'Hello, Where did you join the server from?\nPlease be clear or we will not verify you!',
                    'Why did you join the server?',
                    'Are you a furry?',
                    'Tell us alittle about yourself and your fursona',
                    'Do you like/know DSTitan?'
                ];
                const answers = [];

                let collectCount = 0;
                let endCount = 0;

                if (button.user.bot) return;

                const filter = m => m.author.id === button.user.id;
                button.user.send({
                    content: questions[collectCount++]
                }).then((start) => {
                    const channel = start.channel;
                    const appchannel = Main.getClient().channels.cache.get('767406744716181504');

                    const collector = channel.createMessageCollector({
                        filter,
                        time: 90000
                    });

                    collector.on('collect', (i) => {
                        if (i.author.bot) return;
                        if (['stop', 'cancel'].includes(i.content.toLowerCase())) {
                            collector.stop('Cancel');
                            channel.send({
                                content: 'Okie canceling'
                            }).catch(() => {});
                            return;
                        }
                        if (collectCount < 6) {
                            collector.resetTimer();
                            answers.push(i.content);
                            channel.send({
                                content: questions[collectCount++]
                            }).catch(() => {});
                        }
                        if (answers.length === 5) {
                            collector.stop('Complete');
                            channel.send({
                                content: 'Thankies! Your application has been sent!'
                            }).catch(() => {});
                        }
                    });
                    collector.on('end', (collected, reason) => {
                        if (reason === 'Complete') {
                            const embed = new Discord.MessageEmbed({
                                title: 'Verification Application',
                                description: `\`From:\` \`${button.user.tag}\`\n\`ID:\` \`${button.user.id}\``,
                                thumbnail: {
                                    url: button.user.displayAvatarURL({
                                        size: 1024,
                                        dynamic: true
                                    })
                                },
                                timestamp: button.user.createdTimestamp,
                                footer: {
                                    text: button.user.id
                                },
                                color: Colors.LIGHT_PURPLE
                            });

                            answers.map((msg) => {
                                return embed.addField('>>> ' + questions[endCount++], msg);
                            });

                            appchannel.send({
                                embeds: [embed],
                                components: [new Discord.MessageActionRow({
                                    components: [
                                        new Discord.MessageButton({
                                            customId: 'VerifyUser',
                                            label: 'Verify',
                                            style: 'SUCCESS'
                                        }),
                                        new Discord.MessageButton({
                                            customId: 'DenyUser',
                                            label: 'Deny',
                                            style: 'DANGER'
                                        })
                                    ]
                                })]
                            }).catch(() => {});

                        } else if (reason === 'Cancel') {
                            return;
                        } else {
                            channel.send({
                                content: 'Your time ran out please try again'
                            }).catch(() => {});
                        }
                    })
                }).catch(() => {});
            }
        }
        if (button.customId === 'Terms') {
            button.user.send({
                embeds: [{
                    "title": "__Community Terms__ 📜",
                    "description": "Hoi, Please read our terms Stay Safe! :purple_heart: [**Our Website**](http://dstitan.codes/)\nNeed any quick help? Read the guidelines or use `t?support` <#744786659996074057>",
                    "color": 14237951,
                    "fields": [{
                            "name": "Age",
                            "value": ">>> You must be 13+ [**Follow Discord ToS**](https://discord.com/terms), If You're Under the Age of 13 Pls Leave."
                        },
                        {
                            "name": "Kindness",
                            "value": ">>> Harassment is not allowed this includes DMS. Be kind to others, If you have any hurtful opinions please keep them to yourself."
                        },
                        {
                            "name": "Self-Harm",
                            "value": ">>> No suicidal Roleplay, jokes, or chatting. If you are in need of help pls contact a hotline."
                        },
                        {
                            "name": "Self-Promotion",
                            "value": ">>> Self-promotion is not allowed unless permitted by Staff under specific circumstances. Unsolicited ads of other discord servers sent through DMs will result in punishment."
                        },
                        {
                            "name": "Social",
                            "value": ">>> No Anti-LGBT Racism or sexism, Don't talk of politics or religion or you will be Banned. No conversation about alcohol, addicting substances such as drugs like etcetera, or anything illegal is not allowed."
                        },
                        {
                            "name": "Pings & Spam",
                            "value": ">>> Do not spam or spam ping, Only ping Staff if it's really important.\n`t?support`  or <#744786659996074057> If You Have Questions And We Will Reply As Fast As We Can."
                        },
                        {
                            "name": "Private Information",
                            "value": ">>> DO not share private information or content without consent. Do not bring DM issues and problems to the server!"
                        },
                        {
                            "name": "Loud Audio",
                            "value": ">>> Shouting in your microphone, playing loud audios, overall making your audio inaudible will result in a server voice mute. Reoccurring will result in a BAN."
                        },
                        {
                            "name": "Blocks & Bypass",
                            "value": ">>> Don't block any staff members to get out of problems, Do not try to bypass a ban!"
                        },
                        {
                            "name": "NSFW",
                            "value": ">>> NSFW/explicit/suggestive content is not allowed in any form in the server. This includes your profile picture, username, status, and every form of text and media sent. Hinting, cropping, or attempting to censor does not exclude you from this rule."
                        },
                        {
                            "name": "Drama & Arguments",
                            "value": ">>> We want our community to be drama-free! Any drama will be eliminated by the staff. No personal attacks or witch-hunting. Do not argue over small things."
                        },
                        {
                            "name": "Alternate Accounts",
                            "value": ">>> Alternate accounts are not allowed! Using an alternate account to win a giveaway is not allowed, If we find out that you joined a giveaway with 2 or more accounts it will lead to a 30-60 day ban or perm ban depending."
                        },
                        {
                            "name": "Bad Words",
                            "value": ">>> Swearing is not allowed. you will be warned, any continuation will result in a mute."
                        }
                    ],
                    "footer": {
                        "text": "Thank you for reading and hope you have a great time!"
                    }
                }]
            });
            button.deferUpdate();
        }
        if (button.customId === 'VerifyUser') {
            button.deferUpdate().catch(() => {});
            const message = button.message;
            if (message.embeds[0]) {
                const embed = message.embeds[0];
                const userID = embed.footer.text;
                Main.getClient().guilds.fetch('708843719528284262').then(guild => {
                    guild.members.fetch(userID).then(member => {
                        if (member) {
                            member.roles.add('739111886234320896');
                            member.roles.remove('760315425861926932');
                            member.send({
                                content: 'You have been verified! Go get your roles and have fun bean! <#716635158228369470> <#738057618215403570>'
                            });
                            message.edit({
                                embeds: [new Discord.MessageEmbed({
                                    title: embed.title + ' - Verified',
                                    description: `${embed.description}\n\n \`User Verified by ${button.user.tag}\` <@${button.user.id}>`,
                                    thumbnail: {
                                        url: embed.thumbnail.url
                                    },
                                    timestamp: embed.timestamp,
                                    fields: embed.fields,
                                    color: Colors.TITAN_GREEN
                                })],
                                components: []
                            }).catch(() => {});
                        }
                    }).catch(() => {

                        message.edit({
                            embeds: [new Discord.MessageEmbed({
                                title: embed.title + ' - Canceled',
                                description: `${embed.description}\n\n \`User is no longer in the server\``,
                                thumbnail: {
                                    url: embed.thumbnail.url
                                },
                                timestamp: embed.timestamp,
                                fields: embed.fields,
                                color: Colors.RED
                            })],
                            components: []
                        }).catch(() => {});
                    });
                }).catch(() => {});
            }
        }
        if (button.customId === 'DenyUser') {
            button.deferUpdate().catch(() => {});
            const message = button.message;
            if (message.embeds[0]) {
                const embed = message.embeds[0];
                const userID = embed.footer.text;
                Main.getClient().guilds.fetch('708843719528284262').then(guild => {
                    guild.members.fetch(userID).then(member => {
                        if (member) {
                            message.edit({
                                embeds: [new Discord.MessageEmbed({
                                    title: embed.title + ' - Denied',
                                    description: `${embed.description}\n\n \`User Denied by ${button.user.tag}\` <@${button.user.id}>`,
                                    thumbnail: {
                                        url: embed.thumbnail.url
                                    },
                                    timestamp: embed.timestamp,
                                    fields: embed.fields,
                                    color: Colors.RED
                                })],
                                components: []
                            }).catch(() => {});
                        }
                    }).catch(() => {
                        message.edit({
                            embeds: [new Discord.MessageEmbed({
                                title: embed.title + ' - Canceled',
                                description: `${embed.description}\n\n \`User is no longer in the server\``,
                                thumbnail: {
                                    url: embed.thumbnail.url
                                },
                                timestamp: embed.timestamp,
                                fields: embed.fields,
                                color: Colors.RED
                            })],
                            components: []
                        }).catch(() => {});
                    });
                }).catch(() => {});
            }
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

            if (button.user.id === button.user.id && button.customId === 'Delete') {
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

        const filter = (button) => button.user.id === button.user.id;
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
const handleVerify = async (message, embed, accept, time = 60000, userID = button.user.id, buttonName = ['Continue', 'Decline']) => {

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

        const filter = (button) => button.user.id === button.user.id;
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
                Main.getDistubeClient().playVoiceChannel(Main.getClient().channels.cache.get('708843720019017751'), Utils.randomElement(songGenres) + ' Live Music Radio', {
                    textChannel: Main.getClient().channels.cache.get('717400629043134526')
                });
            }

            if (button.customId === 'Radio') {
                Main.getDistubeClient().stop(message);
                msg.edit({
                    components: []
                });
                Main.getDistubeClient().playVoiceChannel(Main.getClient().channels.cache.get('708843720019017751'), Utils.randomElement(songGenres) + ' Live Music Radio', {
                    textChannel: Main.getClient().channels.cache.get('717400629043134526')
                });
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