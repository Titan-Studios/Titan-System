module.exports = client => {
    
    const config = require('./config.json')
    
    const channelIDs = [
        //'763790123950669854', //test
    ]

    const addReaction = message =>{
        message.react('🟢')
        setTimeout(() => {
            message.react('🔴')
        }, 750)
    }

    client.on('message', async (message) => {
        if(channelIDs.includes(message.channel.id)){
            addReaction(message)
        }else if(message.content.toLowerCase() === `${config.prefix}poll`){
            await message.delete()

            const fetched = await message.channel.messages.fetch({ limit: 1 })
            if(fetched && fetched.first()){
                addReaction(fetched.first())
            }
        }
    })
}