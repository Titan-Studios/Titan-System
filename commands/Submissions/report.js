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
  commands: 'report',
  minArgs: 1,
  expectedArgs: 't!report <user> <report message>',
  callback: async (userMessage, arguments, text, client) => {

    if(userMessage.channel.type == "dm"){
      return userMessage.channel.send('You cant use that command in DMs')
     }
    
    const mentions = userMessage.mentions.members.first()

    const { guild, member } = userMessage

    registerEvent(client)

    const help = new Discord.MessageEmbed()
    .setTitle('A User Was Reported')
    .setDescription(arguments.split(mentions).join(' '))
    .setFooter(`Click the ${check} icon when this report has been resolved.`)
    .setColor('RANDOM')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields({
        name: 'User Reported',
        value: `<@${mentions.id}>`
    },
        {
        name: 'Reporter',
        value: `<@${member.id}>`
    })

    const reply = new Discord.MessageEmbed()
    .setTitle(`Dont Worry! ${mentions.user.username} Has Been Reported!`)
    .setDescription('Please wait while our staff team reviews the report, Expect a reply within 6-12 hours.')
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
