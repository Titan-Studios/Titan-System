// Discord.js & Client. -->
{
const Discord = require('discord.js');
const client = new Discord.Client();

// File entries. -->

const config = require('./config.json')
const command = require('./command')
const poll = require('./poll')

// Message Funtions. -->

const serverInvite = 'https://discord.gg/R2YFteN'
const tag = '<@!745849628825747458>'
const rollDice = () => Math.floor(Math.random() * 6) + 1;
const roll1000 = () => Math.floor(Math.random() * 1000) + 1;

// Startup & Commands. -->

client.on('ready' , () => {
    console.log('Titan 2.2 Is Ready On')
    poll(client)
    

// Public Commands. -->

// Fun Commands. -->

command(client, '1000', message => {
    message.channel.send( roll1000() )
})

command(client, 'roll', message => {
    message.channel.send( "You rolled a " + rollDice() )
})

// Mod Commands. -->

command(client, 'kick', message => {
        const { member, mentions } = message
        const tag = `<@${member.id}>`
    
        if(

            member.hasPermission('ADMINISTRATOR') ||
            member.hasPermission('KICK_MEMBERS')
        ){

            const target = mentions.users.first()
            if (target) {
                const targetMember = message.guild.members.cache.get(target.id)
                if (targetMember.hasPermission('ADMINISTRATOR') || targetMember.hasPermission('KICK_MEMBERS')) {
                    return message.channel.send('You cannot kick that member!');
                } else {
                    targetMember.kick()
                    message.channel.send(`Kicked <@${target.id}> 💥`)
                }
            } else {
                message.channel.send(`${tag} Please tag a member to kick`)
            }
        }else {
            message.channel.send(`${tag} You Can't Use That Command!`)
        }
    })

command(client, 'ban', message => {
    const { member, mentions } = message
    const tag = `<@${member.id}>`

    if(
        member.hasPermission('ADMINISTRATOR') ||
        member.hasPermission('BAN_MEMBERS')
    ){
        const target = mentions.users.first()
        if (target) {
            const targetMember = message.guild.members.cache.get(target.id)
            if (targetMember.hasPermission('ADMINISTRATOR') || targetMember.hasPermission('BAN_MEMBERS')) {
                return message.channel.send('You cannot ban that member!');
            } else {
                targetMember.kick()
                message.channel.send(`Banned <@${target.id}> 💥`)
            }
        } else {
            message.channel.send(`${tag} Please tag a member to ban`)
        }
    }else {
        message.channel.send(`${tag} You Can't Use That Command!`)
    }
})

command(client, 'clear', message => {
    if (message.member.hasPermission('ADMINISTRATOR')) {
    message.channel.messages.fetch().then((results) => {
        message.channel.bulkDelete(results)
    })
    }else {
        message.channel.send(`<@${member.id}> You Can't Use That Command!`)
    }
})

// General Commands. -->

command(client, 'serverinfo', message => {
    const { guild } = message

    const { name, region, memberCount, owner, afkTimeout } = guild
    const icon = guild.iconURL()
    const created = guild.createdAt

    const embed = new Discord.MessageEmbed()
    .setTitle(`**${name}**`)
    .setThumbnail(icon)
    .addFields({
        name: '📜 Info',
        value: `Description: ${guild.description}\nVerification Level: ${guild.verificationLevel}\nRegion: ${region}\n\n[Icon](${icon})`,
        inline: false,
    },{
        name: '👥 Members',
        value: memberCount,
        inline: true,
    },{
        name: '⭐️ Boosts',
        value: `Boots: ${guild.premiumSubscriptionCount}\nLevel: ${guild.premiumTier}`,
        inline: true,
    },{
        name: '🔮 Owner',
        value: owner.user.tag,
        inline: true,
    },{
        name: '⚡️ Created On',
        value: created,
        inline: true,
    },{
        name: '💾 Other',
        value: `Partenered: ${guild.partnered}\nVerified: ${guild.verified}`,
        inline: true,
    },{
        name: '💥 Prefix',
        value: `${config.prefix}\n\n[Help & Support](${serverInvite})`,
        inline: false,
    },)
    .setFooter(`ID ${guild.id}`)
    .setColor('#8A2BE2')

    message.channel.send(embed)
})

command(client, 'invite', message => {
    const sInvite = new Discord.MessageEmbed()
    .setTitle('Join Our Community')
    .setURL(serverInvite)
    .setDescription('Come join our discord server!\n If you have any questions come ask us!')

    message.channel.send(sInvite)
    message.channel.send(serverInvite)
})

command(client, 'help', message => {
    const help = new Discord.MessageEmbed()
    .setTitle('DSTitan 2.2 **Beta**')
    .setDescription('This is a General Bot\n If you have any questions you can ask us [here](https://discord.gg/R2YFteN)!\n\nPrefix `t`\n\nIf theres any bugs please come tell Us, [Report Bug](https://discord.gg/R2YFteN)')
    .setFooter('Note: This bot is a beta & still under work! | Beta 0.1')
    .addFields(
        {
        name: 'General',
        value: 'thelp - *shows this message*\ntpoll - *makes a poll,(send your poll before sending the command)*\ntserverinfo - *shows server info*\ntinvite - *sends invite message*'
        },
        {
            name: 'Moderation',
            value: 'tclear - *clears messages*\ntkick - *kicks member*\ntban - *bans member*\ntmute - *mutes member*'
        },
        {
            name: 'Fun',
            value: 'troll - *rolls a dice*\nt1000 - *rolls a number between 1-1000*\nMore Coming Soon!'
        },
        {
            name: 'Other',
            value: 'Coming Soon!'
        }


    )
    message.react('749843034753204294')    
    message.author.send(help)
})

// Other Commands. -->

// Private Commands. -->

command(client, 'bottstatus', (message) => {
   const content = message.content.replace('tbottstatus ', '')
        // "!status hello world" -> "hello world"

        client.user.setPresence({
        activity: {
        name: content,
        type: 0,
      },
    })
    
    
  })

command(client, 'serverlist', message => {
    client.guilds.cache.forEach((guild) => {
        message.author.send(
            `**__${guild.name}__** has **${guild.memberCount}** members`
        )
    })
})

})

// Other. -->

client.on('message', function(message){
    if (message.author.bot) return;

    if(message.content.startsWith(tag)){
        message.channel.send(`My prefix is **${config.prefix}**`)
    }
})

// Token. -->

client.login(process.env.token);
}