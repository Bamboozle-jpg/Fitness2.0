const DiscordJS = require('discord.js');
const { IntentsBitField, GatewayIntentBits } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
const { channel, Channel } = require('diagnostics_channel');
const { Collection } = require('discord.js')
const path = require('node:path')
dotenv.config();

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

//When a message is sent
// client.on('messageCreate', (message) => {
//     var channel = message.channelId;

//     //Make sure message isn't by a bot
//     if (!message.author.bot) {

//         //Then read people.json
//         fs.readFile("./people.json", "utf8", (err, jsonString) => {
//             if (err) {
//                 console.log("File read failed:", err);
//                 return;
//             }
//             try {

//                 //Parse people.json
//                 const people = JSON.parse(jsonString);

//                 //If the message sender is a key value, send the contents of that key
//                 if (people[personName]) {

//                     //Increases that persons score
//                     people[personName]++;
//                     console.log(people[personName]);

//                     //Writes the increase in score to the file
//                     fs.writeFile("./people.json", JSON.stringify(people, null, 4), err => {
//                         if (err) console.log("Error writing file:", err);
//                     });
//                     client.channels.cache.get(channel).send(personName+' has a score of '+people[personName]); 

//                 //If not, add it to the file
//                 } else {
//                     client.channels.cache.get(channel).send(personName+' is not in the database yet, adding it now');

//                     //start off their score at one, and create it and stringify
//                     people[personName] = 1;
//                     const jsonString = JSON.stringify(people, null, 4);

//                     //Write it to the file
//                     fs.writeFile('./people.json', jsonString, err => {
//                         if (err) {
//                             console.log('Error writing file', err)
//                         } else {
//                             console.log('Successfully wrote file')
//                         }
//                     })
//                 }
//             } catch (err) {
//                 console.log("Error parsing JSON string:", err);
//             }
//         });
//     }
// })

client.on('interactionCreate', async interaction => {
    // makes sure it's a command
    if (!interaction.isChatInputCommand()) return;

    // gets desired command
    const command = client.commands.get(interaction.commandName);

    // ensures desired command exists
    if (!command) return;

    // actually does the command
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({content: "There was an issue running your command", ephemeral: true});
    }
})