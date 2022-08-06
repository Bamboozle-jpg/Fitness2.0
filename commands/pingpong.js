const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    // command info
    data: new SlashCommandBuilder()
        .setName("pingpong")
        .setDescription("Ping pong :D"),
    
    // runs command
    async execute(interaction) {


        
        await interaction.reply("Pong!")
    }
}