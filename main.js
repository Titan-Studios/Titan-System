// Discord.js & Client. -->


const path = require('path')
const fs = require('fs')
const { Client, Intents } = require('discord.js');
const client = new Client({ ws: { intents: Intents.ALL } }, { disableEveryone: true });

const config = require('./config.json')
// Startup & Commands. 

client.on('ready' , async () => {
    console.log('System Is Online')

    client.user.setActivity("Titan's Community | t!" , {
        type: "WATCHING"
    }).catch(console.error);

    const baseFile = 'command-base.js'
    const commandBase = require(`./commands/${baseFile}`)

    const readCommands = dir => {
        const files =  fs.readdirSync(path.join(__dirname, dir))
        for (const file of files){
            const stat = fs.lstatSync(path.join(__dirname, dir, file))
            if(stat.isDirectory()){
                readCommands(path.join(dir, file))
            }else if(file !== baseFile){
                const option = require(path.join(__dirname, dir, file))
                commandBase(client, option)
            }
        }
    }

    readCommands('commands')
})

client.login(process.env.token);
// client.login(config.token);