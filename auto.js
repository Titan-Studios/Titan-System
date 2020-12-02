const Discord = require('discord.js')

module.exports = async (client) =>{

  try {

  let reply = [
      'You can type `tchangelog` to see the latest changes',
      'If you need help with anything type `t!support`',
      'Want to report a member? type `t!report`',
      'If you think theres a bug use `t!bug`',
      'Wanna become a Verified Creator? Use `t!creator`',
      'Add "Titan Bot" to your servers!',
      'Suggest commands to be added in <#762316868055990293>',
      'Did you know Siyntax is a cutie',
      'Hope everyones staying safe! Love you all!',
      'Hey, Maybe you should read our FAQ <#762540016006070302>',
      'Would you like to support Titan? Use `tdonate`',
      'Send a cute image in <#716634270730420225> ❤️',
      'If you have the verified creator role, You can use the t!post command!',
      'Invite your friends!',
      'Psst, Maybe bump the server?'
  ]
  let repling = Math.floor((Math.random() * reply.length));

  const channel = await client.channels.fetch('773701109470461962')

  const webhooks = await channel.fetchWebhooks();
            const webhook = webhooks.first();
    
            await webhook.send(reply[repling], {
                username: 'System Message',
                avatarURL: 'https://images-ext-1.discordapp.net/external/vb3329wgzfRqfuJJ2sdTbCgB6E_Wd4Sm8VSNe-RXAE0/%3Fsize%3D2048/https/cdn.discordapp.com/avatars/745123015762640896/72d6a49bd76574b735e9dba38e75f5d4.png'
            });
} catch (error) {
console.error('Error trying to send: ', error);
}

  
}