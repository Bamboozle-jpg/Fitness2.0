/*
Formate for people is 
discord ID
0 : Full streak #
1 : half streak #
2 : full streak active or not
3 : half streak active or not
4 : name
*/

const DiscordJS = require('discord.js');
const { IntentsBitField, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
const { channel, Channel } = require('diagnostics_channel');
const { Collection } = require('discord.js')
const path = require('node:path')
dotenv.config();
var globEveryone

const client = new DiscordJS.Client({
    // What the bot will have access to
    intents : [
        GatewayIntentBits.Guilds,
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ]
});

// pretty much gets the list of all the commands?
// sets up commands, but doesn't call them
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandsFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
}

//Tells console when bot is turned on
client.on('ready', () => {
    console.log("The Bot is Ready");
});

//Log in to bot
client.login(process.env.TOKEN);

client.on('messageCreate', (message) => {
    var channel = message.channelId;
    var guildString = process.env.guildId + '';

    //Make sure message isn't by a bot
    if (!message.author.bot && message.content === '!reset') {

        //Then read people.json
        fs.readFile("./people.json", "utf8", (err, jsonString) => {
            const channel = message.channelId
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {

                //Parse people.json
                const people = JSON.parse(jsonString)

                //Resets everyone's score for the day
                for (const person in people) {
                
                    var userName = people[person][4]

                    //If they haven't done full workout today, kill full workout streak
                    if (!people[person][2] && people[person][0]) {
                        client.channels.cache.get(channel).send(userName+' lost their full streak of **'+people[person][0]+'**.');
                        people[person][0] = 0;
                    }

                    //If they haven't done half workout today, kill half workout streak
                    if (!people[person][3] && people[person][1]) {
                        client.channels.cache.get(channel).send(userName+' lost their half streak of **'+people[person][1]+'**.');
                        people[person][1] = 0;
                    }

                    people[person][2] = false;
                    people[person][3] = false;
                }

                //Writes the day reset to file (rewrites file with new values)
                fs.writeFile("./people.json", JSON.stringify(people, null, 4), err => {
                    if (err) console.log("Error writing file:", err);
                });
            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
    }
})

client.on('interactionCreate', async interaction => {
    // makes sure it's a command
    if (!interaction.isChatInputCommand()) return;

    // gets desired command
    const command = client.commands.get(interaction.commandName);

    // ensures desired command exists
    if (!command) return;

    // actually does the command
    try {
        await command.execute(interaction, client);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: "There was an issue running your command", ephemeral: true});
    }
})