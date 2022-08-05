const DiscordJS = require('discord.js');
const { IntentsBitField } = require('discord.js');
const dotenv = require('dotenv');
dotenv.config()

const client = new DiscordJS.Client({
    // What the bot will have access to
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages
    ]
})

client.on('ready', () => {
    console.log("The Bot is Ready");
})

client.login(process.env.TOKEN)

client.on('messageCreate', (Message) => {
    if (Message.content === 'ping') {
        Message.reply({
            content: ':sad:'
        })
    }
})