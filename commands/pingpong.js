const {SlashCommandBuilder} = require('discord.js');

module.exports = {
    // command info
    data: new SlashCommandBuilder()
        .setName("pingpong")
        .setDescription("Ping pong :D"),
    
    // runs command
    async execution(interaction) {


        
        await interaction.reply("Pong!")
    }
}