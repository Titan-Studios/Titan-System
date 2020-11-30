const talkedRecently = new Set();
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
  commands: ['ask', 'asktitan'],
  minArgs: 1,
  expectedArgs: 't!ask <question for titan>',
  callback: async (userMessage, arguments, text, client) => {

    if(userMessage.channel.type == "dm"){
      return message.channel.send('You cant use that command in DMs')
     }

    const { guild, member } = userMessage
    
    if(userMessage.guild.id !== '708843719528284262') {
      return userMessage.reply('That command is only valid in **DSTitans Official Community**, `tinvite`')
    }

    if (!member.roles.cache.has('741482855451983892')) {
      return message.channel.send('Sorry, This command is Premium Collar Only, Subscribe to Titans patreon to unlock this command! `https://www.patreon.com/DSTitan`')
    }
    
    if (talkedRecently.has(message.author.id)) {
      message.channel.send("You cant ask Titan anything yet, You'll need to wait about 3 hours before asking him something again");
} else {

    registerEvent(client)

    const help = new Discord.MessageEmbed()
    .setTitle(`${member.username} Asks`)
    .setDescription(text)
    .setFooter(`ID ${member.id}`)
    .setColor('RANDOM')
    .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
    .addFields({
        name: 'From',
        value: `<@${member.id}>`
    })

    const reply = new Discord.MessageEmbed()
    .setTitle('UwU Message Sent To Titan')
    .setDescription(`I sent your question to Titan, He will reply to you when he can!`)
    .addField('Your Question', `${text}`, false)
    .setColor('RANDOM')

    const channel = await client.channels.fetch(channelId)
    channel
      .send(help)
      .then((ticketMessage) => {
        ticketMessage.react(check)

        userMessage.reply(reply)
        userMessage.delete()
      })

  // Adds the user to the set so that they can't talk for a minute
  talkedRecently.add(message.author.id);
  setTimeout(() => {
    // Removes the user from the set after a minute
    talkedRecently.delete(message.author.id);
  }, 11000000);
}

  },
}
