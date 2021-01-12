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
  commands: ['partner', 'partnership'],
  minArgs: 3,
  expectedArgs: '\n**Requirements**\n• No NSFW Servers. Unless The Verification Process Is High.\n• Must Follow Discord TOS.\n• Minimum Member Count Of 75-100.\n• No Servers That Incorvages Hate Or Raid.\n\n**Format**\n```\nt!partner\nServer Info*:\nServer Link*:\nServer Members*:\nServer Age:\n```',
  callback: async (userMessage, arguments, text, client) => {

    if(userMessage.channel.type == "dm"){
      return userMessage.channel.send('You cant use that command in DMs')
     }
    
    const { guild, member } = userMessage

    registerEvent(client)

    const help = new Discord.MessageEmbed()
    .setTitle('A Partnership Application Has Been Created')
    .setDescription(text)
    .setFooter(`Click the ${check} icon when this application has been answered.`)
    .setColor('RANDOM')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields({
        name: 'From',
        value: `<@${member.id}>`
    })

    const reply = new Discord.MessageEmbed()
    .setTitle('Weee! Partnership!')
    .setDescription('Please wait while our staff team reviews your partnership application, Expect a reply within 24 hours.')
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
