const Discord = require('discord.js')


module.exports = {
    commands: 'post',
    minArgs: 1,
    expectedArgs: '``\nt!post <post message/description> <image(optional)>\n``', //\nIf you need anymore help with this command type t!posting help``',
    permissionError: 'You cant use that command!',
    callback: async (message, arguments, text, client) => {

        if(message.channel.type == "dm"){
         return message.channel.send('You cant use that command in DMs')
        }

        const { guild, member } = message

        if (!member.roles.cache.has('730130685662199898')) {
          return message.channel.send(
            `You need to be a verified creator to use this command!`
          )
          
        }
        
        const user = message.author

        let messageAttachment = message.attachments.size > 0 ? message.attachments.array()[0].url : null

        const embed = new Discord.MessageEmbed()
        .setTitle(`New Post From **${user.username}**!`)
        .setDescription(`${text}`)
        .setImage(messageAttachment)
        .setColor(member.displayHexColor)
        .setFooter(`User: ${user.tag} | ID: ${user.id}`)
        .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))

        const reply = new Discord.MessageEmbed()
        .setTitle(`You Did It!`)
        .setColor(`#BFFF00`)
        .setDescription(`Your Post Has Been Uploaded To <#757634366624235541> Go Check It Out!`)
        
        const channel = await client.channels.fetch('757634366624235541')

        channel.send(embed).then((ticketMessage) => {
        ticketMessage.react('749837495117807696')
        ticketMessage.react('778780004234297364')
        ticketMessage.react('❤️')

        message.reply(reply).then(m => m.delete({timeout: 5000}))
        message.delete()
      })
  
  

    },
    permissions: [],
    requiredRoles: []
}