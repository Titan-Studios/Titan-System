module.exports = (client) => {
    const channelId = '716634069970059286' // welcome channel
    const targetChannelId = '716634466399027200' // rules and info
  
    client.on('guildMemberAdd', (member) => {

        const welcome = new Discord.MessageEmbed()
            .setTitle('Welcome To The Community')
            .setURL('https://twitter.com/deathstormtitan')
            .setDescription(`Hello new member, welcome! Please dont forget to read our ${member.guild.channels.cache.get(targetChannelId).toString()}\n We hope you emjoy staying!`)
            .setImage('https://cdn.discordapp.com/attachments/716634615141367840/760502742925049886/Titan_Offical_Community3.png')
            .setColor('#85FF00')

        const message = `<@${member.id} ${welcome}`
  
        const channel = member.guild.channels.cache.get(channelId)
        channel.send(message)
    })
  }
  