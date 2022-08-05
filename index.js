const DiscordJS = require('discord.js');
const { IntentsBitField } = require('discord.js');
const fs = require('fs');
const dotenv = require('dotenv');
const { channel, Channel } = require('diagnostics_channel');
dotenv.config();

const client = new DiscordJS.Client({
    // What the bot will have access to
    intents : [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessageReactions,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.DirectMessages,
    ]
});

//Tells console when bot is turned on
client.on('ready', () => {
    console.log("The Bot is Ready");
});

//Log in to bot
client.login(process.env.TOKEN);

//When a message is sent
client.on('messageCreate', (message) => {
    var channel = message.channelId;

    //Make sure message isn't by a bot
    if (!message.author.bot) {
        var name = message.author.username;
        var content = message.content;

        //First reply to message and say hi
        message.reply({content: 'Hi, '+name});

        //Then read people.json
        fs.readFile("./people.json", "utf8", (err, jsonString) => {
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {

                //Parse people.json
                const people = JSON.parse(jsonString);

                //If the message sender is a key value, send the contents of that key
                if (people[name]) {

                    //Increases that persons score
                    people[name]++;
                    console.log(people[name]);

                    //Writes the increase in score to the file
                    fs.writeFile("./people.json", JSON.stringify(people, null, 4), err => {
                        if (err) console.log("Error writing file:", err);
                    });
                    client.channels.cache.get(channel).send(name+' has a score of '+people[name]); 

                //If not, add it to the file
                } else {
                    client.channels.cache.get(channel).send(name+' is not in the database yet, adding it now');

                    //start off their score at one, and create it and stringify
                    people[name] = 1;
                    const jsonString = JSON.stringify(people, null, 4);

                    //Write it to the file
                    fs.writeFile('./people.json', jsonString, err => {
                        if (err) {
                            console.log('Error writing file', err)
                        } else {
                            console.log('Successfully wrote file')
                        }
                    })
                }
            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
    }
})