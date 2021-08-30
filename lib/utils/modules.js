const Discord = require('discord.js');
const Distube = require('distube');
const Main = require('../../index');
const Utils = require('./utils');
const Colors = require('./colors');
const Moment = require('moment');

const songGenres = [
    'Lofi',
    'Pop',
    'Hiphop',
    'Hits Radio 1',
    'House',
    'Chill'
]

/**
 * @param {Main.getClient()} client
 */

const userJoinAndLeave = (client = Main.getClient()) => {
    client.users.fetch('625487161092866107').then((user) => {
        const time = Math.floor(new Date().getTime()/1000.0);
        user.send({content: `\`System Started!\`\n<t:${time}:F> <t:${time}:R>`})
    });

    client.on('guildMemberAdd', member => {
        if (!member) return;
        const channel = member.guild.channels.cache.find(channel => channel.id === '716634069970059286');
        const chat = member.guild.channels.cache.find(channel => channel.id === '738057618215403570');

        let replyTitle = Utils.randomElement([
            `A wild ${member.user.username} just appeared!`,
            `Hey the cutie ${member.user.username} is here!`,
            `${member.user.username} did you bring any food`,
            `OWO whats this? a ${member.user.username}.`,
            `${member.user.username} slides in!`,
            `${member.user.username} leave your weapons at the door`

        ]);

        const embed = new Discord.MessageEmbed({
            color: Colors.TITAN_GREEN,
            title: replyTitle,
            description: `Hewo ${member}, Welcome!\n\nWe hope you have a great time and make new friends! Stream, play games, chill, share your thoughts and have loads of fun!\n\nTo become an official member of the community head over to <#716634466399027200>!`,
            footer: {
                text: `If you want answers to questions read our FAQ | ${member.guild.memberCount}`
            },
            image: {
                url: 'https://images-ext-1.discordapp.net/external/b2TIzRRPwzjmFMpeQuZ7WuH3-N7bbGpCu_2TOh91ExU/https/cdn.probot.io/Ey7ZxzY4BG.png?width=1025&height=258'
            },
            thumbnail: {
                url: member.user.displayAvatarURL()
            }
        });

        channel.send({embeds: [embed]}).then(() => {
            chat.send({content: `${member.user} Just Joined\nCreated <t:${member.user.createdAt}:R>`});
            member.roles.add('760315425861926932');
            member.roles.add('880852923628789860');
            member.roles.add('880855152490328114');
            member.roles.add('880849661148155975');
            member.roles.add('880848528820273174');
            setTimeout(() => {
                member.roles.add('769118007552638997');
            }, 15 * 60 * 1000);
        });
    });

    client.on('guildBanAdd', banned => {
        if (!banned) return;
        const guild = banned.guild;
        guild.fetchAuditLogs().then(logs => {
            logs.entries.filter(l => l.action === 'MEMBER_BAN_ADD')
                .forEach(log => {
                    if (Date.now() - log.createdTimestamp > 2000) return;
                    
                    const channel = guild.channels.cache.find(channel => channel.id === '716634069970059286');
                    const chat = guild.channels.cache.find(channel => channel.id === '738057618215403570');

                    let replyTitle = Utils.randomElement([
                        `Banned ${log.target.username}`,
                        `Welp ${log.target.username} Was banned!`,
                        `Take this ban hammer to the face ${log.target.username}`,
                        `Totaly destroys ${log.target.username} with the ban hammer`,
                        `${log.target.username} Died!`,
                        `${log.target.username} <-- this person is a rule breaker >:c`
                    ]);

                    const embed = new Discord.MessageEmbed({
                        color: Colors.RED,
                        title: replyTitle,
                        description: `Banned ${log.target},\n\n Hope you learn your lesson!`,
                        footer: {
                            text: `>:c i angy | ${guild.memberCount}`
                        },
                        thumbnail: {
                            url: log.target.displayAvatarURL()
                        }
                    });

                    channel.send({embeds: [embed]}).then(() => {
                        chat.send({content: `${log.target.tag} Was Banned\nCreated <t:${log.target.createdAt}:R>`});
                    });
                });
        });
    });

    client.on('guildMemberRemove', member => {
        if (!member) return;
        const channel = member.guild.channels.cache.find(channel => channel.id === '716634069970059286');
        const chat = member.guild.channels.cache.find(channel => channel.id === '738057618215403570');

        let replyTitle = Utils.randomElement([
            `See you later ${member.user.username}`,
            `Nooo ${member.user.username} is no longer here..`,
            `Come on ${member.user.username} we thought you would stay!`,
            `Why did ${member.user.username} leave us.`,
            `${member.user.username} where did you go!`,
            `${member.user.username} ran away..`
        ]);

        const embed = new Discord.MessageEmbed({
            color: Colors.RED,
            title: replyTitle,
            description: `Goodbye ${member},\n\n Hope you had a great time! see you again soon!`,
            footer: {
                text: `Stay Cute! | ${member.guild.memberCount}`
            },
            thumbnail: {
                url: member.user.displayAvatarURL()
            }
        });

        channel.send({embeds: [embed]}).then(() => {
            chat.send({content:`${member.user.tag} Just Left\nCreated <t:${member.user.createdAt}:R>`});
        });
    });
}

/**
 * @param {Distube.default} distube
 * @returns {Promise<void>}
 */
 const distubeMusic = (distube) => {
    distube.playVoiceChannel(Main.getClient().channels.cache.get('708843720019017751'), Utils.randomElement(songGenres) + ' Live Music Radio', {textChannel: Main.getClient().channels.cache.get('717400629043134526')}).catch(() => {});
    distube.on('initQueue', (queue) => {
        queue.autoplay = false;
        queue.volume = 100;
    }).on('empty', (queue) => {
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed({
                color: Colors.RED,
                description: 'Leaving channel'
            })]
        });
        distube.playVoiceChannel(Main.getClient().channels.cache.get('708843720019017751'), Utils.randomElement(songGenres) + ' Live Music Radio', {textChannel: Main.getClient().channels.cache.get('717400629043134526')});
    }).on('finish', (queue) => {
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed({
                color: Colors.LIGHT_PURPLE,
                description: 'The queue has ended, Now playing the radio'
            })]
        });
        distube.playVoiceChannel(Main.getClient().channels.cache.get('708843720019017751'), Utils.randomElement(songGenres) + ' Live Music Radio', {textChannel: Main.getClient().channels.cache.get('717400629043134526')});
    }).on('noRelated', (queue) => {
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed({
                color: Colors.RED,
                description: 'Couldnt find a related video'
            })]
        })
    }).on('playSong', (queue, song) => {
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed({
                color: Colors.LIGHT_PURPLE,
                title: 'Playing',
                description: `\`${song.name}\``,
                footer: {
                    text: `Requested By ${song.user.tag}`,
                    icon_url: song.user.displayAvatarURL()
                },
                url: song.url
            })]
        });
    }).on('addSong', (queue, song) => {
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed({
                color: Colors.LIGHT_PURPLE,
                title: 'Song Queued',
                description: `\`Name:\` \`${song.name}\`\n\n\`Duration:\` \`${song.isLive ? 'Live 🔴' : song.formattedDuration}\``,
                footer: {
                    text: `Requested By ${song.user.tag}`,
                    icon_url: song.user.displayAvatarURL()
                },
                url: song.url
            })]
        });
    }).on('addList', (queue, playlist) => {
        queue.textChannel.send({
            embeds: [new Discord.MessageEmbed({
                color: Colors.LIGHT_PURPLE,
                title: 'Added Playlist Songs!',
                description: `**Name:** ${playlist.name}\n\n**Playlist Duration:** *${playlist.formattedDuration}*\n\n**Playlist Length:** ${playlist.songs.length.toLocaleString()}\n\n**Queue Length:** ${queue.songs.length.toLocaleString()}`,
                footer: {
                    text: `Requested By ${playlist.user.tag}`,
                    icon_url: playlist.user.displayAvatarURL()
                },
                url: playlist.url
            })]
        });
    }).on('error', (channel, error) => {
        console.log('🟥 | DisTube - Error ' + error);

        channel.send({
            embeds: [new Discord.MessageEmbed({
                color: Colors.RED,
                description: `There was an error\n\`\`\`${error}\`\`\``
            })]
        });
    });
};

module.exports.userJoinAndLeave = userJoinAndLeave;
module.exports.distubeMusic = distubeMusic;

module.exports.button = require('./exports/buttons').handleButtonClick;
module.exports.buttonTimed = require('./exports/buttons').handleMessageButton; 
module.exports.pages = require('./exports/buttons').handlePages; 
module.exports.verify = require('./exports/buttons').handleVerify;
module.exports.queue = require('./exports/buttons').handleQueue;