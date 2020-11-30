const Discord = require('discord.js');
const config = require('../../config.json')

module.exports = {
    
    commands: 'reply',
    minArgs: 2,
    expectedArgs: 't!reply <user> <message>',
    permissionError: 'You cant use that command!',
    callback: (message, arguments, text) => {

        if(userMessage.channel.type == "dm"){
            return message.channel.send('You cant use that command in DMs')
           }

        if(message.guild.id !== '708843719528284262') {
            return userMessage.reply('That command is only valid in **DSTitans Official Community**, `tinvite`')
        }

        const mentions = message.mentions.members.first()

        if(!mentions){
            return message.reply(`Mention a user`)
        }

        const reply = new Discord.MessageEmbed()
    .setTitle('Heres Your Mail!')
    .setDescription(text)
    .setColor('RANDOM')

        mentions.send(reply)
        message.delete()
        message.channel.send(`message sent to ${mentions}!`).then(m => m.delete({timeout: 5000}))
    
    },
    permissions: ['ADMINISTRATOR'],
    
}