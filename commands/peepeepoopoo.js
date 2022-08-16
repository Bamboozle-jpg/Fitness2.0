const {SlashCommandBuilder, userMention} = require('discord.js');
const dotenv = require('dotenv');
dotenv.config();

module.exports = {
    // command info
    data: new SlashCommandBuilder()
        .setName("peepeepoopoo")
        .setDescription("Fine, I'll add it :rolling_eyes:"),
    
    // runs command
    async execute(interaction) {
        special = process.env.special;
        if (interaction.user == special) {
            await interaction.reply(":poop:")
        } else {
            await interaction.reply(":thumbsdown:");
        }
    }
}