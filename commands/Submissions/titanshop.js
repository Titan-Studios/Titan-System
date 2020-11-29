const Discord = require('discord.js');

const embed = new Discord.MessageEmbed()
.setTitle('Titans Official Shop!')
.setDescription('Sorry Titan\'s Shop Is Not Open At The Moment')
.setColor('RANDOM')
.setFooter('Dont Worry The Shop Will Be Open Again Soon!')

module.exports = {
    commands: ['titanshop', 'titan shop'],
    permissionError: 'You cant use that command!',
    callback: (message, arguments, text, client) => {

        message.channel.send(embed)
        
   },
    permissions: [],
}