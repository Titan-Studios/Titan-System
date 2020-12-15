// Discord.js & Client. -->

const Discord = require('discord.js');
const path = require('path')
const fs = require('fs')
const { Client, Intents } = require('discord.js');
const client = new Client({ ws: { intents: Intents.ALL } }, { disableEveryone: true });
const auto = require('./auto')

const config = require('./config.json')
// Startup & Commands. 

client.on('ready' , async () => {
    console.log('System Is Online')

    client.user.setActivity("Titan's Community | t!" , {
        type: "WATCHING"
    }).catch(console.error);

    

    const baseFile = 'command-base.js'
    const commandBase = require(`./commands/${baseFile}`)

    const readCommands = dir => {
        const files =  fs.readdirSync(path.join(__dirname, dir))
        for (const file of files){
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()){
                readCommands(path.join(dir, file))
            }else if(file !== baseFile){
                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option)
            }
        }
    }

    readCommands('commands')

    auto(client)
})

client.on("guildMemberAdd", member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === '716634069970059286')

    let reply = [
        `A wild ${member.username} just appeared!`,
        `Hey the cutie ${member.username} is here!`,
        `${member.username} did you bring any food`,
        `OWO whats this? a ${member.username}.`,
        `${member.username} slides in!`,
        `${member.username} leave your weapons at the door`

    ]
    let repling = Math.floor((Math.random() * reply.length));

    const embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle(reply[repling])
    .setDescription(`Hewo ${member}, Welcome!\n\nWe hope you have a great time and make new friends! Stream share your thoughts and have loads of fun!\n\nTo become an official member of the community head over to <#716634466399027200>!`)
    .setFooter('If you want answers to questions read our FAQ')
    .setThumbnail(member.displayAvatarURL({ format: 'png', dynamic: true }))
    .setImage('https://images-ext-1.discordapp.net/external/b2TIzRRPwzjmFMpeQuZ7WuH3-N7bbGpCu_2TOh91ExU/https/cdn.probot.io/Ey7ZxzY4BG.png?width=1025&height=258')

    welcomeChannel.send(embed)
})

client.on("guildMemberRemove", member => {
    const welcomeChannel = member.guild.channels.cache.find(channel => channel.id === '716634069970059286')

    let reply = [
        `See you later ${member.username}`,
        `Nooo ${member.username} is no longer here..`,
        `Come on ${member.username} we thought you would stay!`,
        `Why did ${member.username} leave us.`,
        `${member.username} where did you go!`,
        `${member.username} ran away..`

    ]
    let repling = Math.floor((Math.random() * reply.length));

    const embed = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTitle(reply[repling])
    .setDescription(`Goodbye ${member},\n\n Hope you had a great time! see you again soon!`)
    .setFooter('Stay safe!')
    .setThumbnail(member.displayAvatarURL({ format: 'png', dynamic: true }))

    welcomeChannel.send(embed)
})

client.login(process.env.token);
