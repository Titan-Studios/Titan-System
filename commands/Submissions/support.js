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
  commands: ['ticket', 'support'],
  minArgs: 1,
  expectedArgs: 't!support <message>',
  callback: async (userMessage, arguments, text, client) => {

    if(message.channel.type == "dm"){
      return message.channel.send('You cant use that command in DMs')
     }
    

    const { guild, member } = userMessage
    

    registerEvent(client)

    const help = new Discord.MessageEmbed()
    .setTitle('This user Needs some help!')
    .setDescription(text)
    .setFooter(`Click the ${check} icon when this issue has been resolved.`)
    .setColor('RANDOM')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields({
        name: 'From',
        value: `<@${member.id}>`
    })

    const reply = new Discord.MessageEmbed()
    .setTitle('Okie Dokie Well Get Right To You!')
    .setDescription('Please wait while our staff team reviews your message, Expect a reply within 24 hours.')
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
