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
  commands: ['apply', 'staff'],
  minArgs: 1,
  expectedArgs: ' - Make sure to read everything to know how to apply\n**Requirements**\n • Must Be 16+.\n • Must Be Level 25+.\n • Must Be In The Server For 2 Months Or More.\n • Must-Have Experience In Managing A Server.\n • Must Have 0 Warns In This Server.\n\n**Staff Positions**\n*You can select more than one.*\n Application Manager - Manages Staff app, Partner app etc\n Event & Giveaway Manager\n Help And Support - Responds and helps members\n Trust And Safety - Looks over members\n Server Manager\n Other - You tell us\n\n**Format**\n```\nt!apply\nStaff Position:\nWhy do you want staff?:\nServers Managed:\nWhat will you Do:\nDOB:\nHow Active Are You:\n```',
  callback: async (userMessage, arguments, text, client) => {

    if(userMessage.channel.type == "dm"){
      return message.channel.send('You cant use that command in DMs')
     }
    
    const { guild, member } = userMessage
    
    registerEvent(client)

    const help = new Discord.MessageEmbed()
    .setTitle('Staff Application')
    .setDescription(text)
    .setFooter(`Click the ${check} icon when this application has been resolved.`)
    .setColor('RANDOM')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields({
        name: 'From',
        value: `<@${member.id}>`
    })

    const reply = new Discord.MessageEmbed()
    .setTitle('Lets See What You Got!')
    .setDescription('Please wait while our staff team reviews your application, Expect a reply within 24 hours.')
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
