const Discord = require('discord.js');
const channelId = '767406744716181504'
const check = '✅'
let registered = false

const registerEvent = (client) => {
  
  if (registered) {
    return
  }

  registered = true

  console.log('REGISTERING EVENTS')

  client.on('messageReactionAdd', (reaction, user) => {
    if (user.bot) {
      return
    }

    console.log('HANDLING REACTION')
    const { message } = reaction
    if (message.channel.id === channelId) {
      message.delete()
    }
  })
}

module.exports = {
  commands: ['request', 'requesttitan'],
  minArgs: 1,
  expectedArgs: 't!request <request>',
  callback: async (userMessage, arguments, text, client) => {

    if(userMessage.channel.type == "dm"){
      return userMessage.channel.send('You cant use that command in DMs')
     }

    const { guild, member } = userMessage
    
    if(userMessage.guild.id !== '708843719528284262') {
      return userMessage.reply('That command is only valid in **DSTitans Official Community**, `tinvite`')
    }

    if (!member.roles.cache.has('750498216843149392')) {
      return userMessage.channel.send('Sorry, This command is Hyper Collar Only, Subscribe to Titans patreon to unlock this command! `https://www.patreon.com/DSTitan`')
    }

    registerEvent(client)

    const help = new Discord.MessageEmbed()
    .setTitle(`${member.username} Requests`)
    .setDescription(text)
    .setFooter(`ID ${member.id}`)
    .setColor('RANDOM')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields({
        name: 'From',
        value: `<@${member.id}>`
    })

    const reply = new Discord.MessageEmbed()
    .setTitle('OwO Request Sent To Titan!')
    .setDescription(`I sent the request to Titan, He will reply to you when he can!`)
    .addField('Your Request', `${text}`, false)
    .setColor('RANDOM')

    const channel = await client.channels.fetch(channelId)
    channel
      .send(help)
      .then((ticketMessage) => {
        ticketMessage.react(check)

        userMessage.reply(reply)
        userMessage.delete()
      })
  },
}
