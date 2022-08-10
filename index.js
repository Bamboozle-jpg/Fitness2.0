/*
Formate for people is 
discord ID
0 : Full streak # (int)
1 : half streak # (int)
2 : full streak active or not (bool)
3 : half streak active or not (bool)
4 : name (String)
5 : Streak freeze active (bool)
6 : How many streak freezes they have to use (int)
7 : How many total workouts they've done (int)
8 : How many total half workouts they've done
9 : Whether they are set to public or private description
10: Actual description itself
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


//Tells it where the commands are
for (const file of commandsFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);

    client.commands.set(command.data.name, command);
}

//Sets up channel we want to send stuff to
const mainChannel = process.env.channelId;
//Log in to bot
client.login(process.env.TOKEN);

function reset() {
    //Then read people.json
    fs.readFile("./people.json", "utf8", (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err);
            return;
        }
        try {

            //Parse people.json
            const people = JSON.parse(jsonString)

            client.channels.cache.get(mainChannel).send('**Workout bot\'s day has reset**');
            //Resets everyone's score for the day
            for (const person in people) {
            
                var userName = people[person][4];

                //checks for streak freeze
                if (people[person][5]) {
                    people[person][5] = false;
                    client.channels.cache.get(mainChannel).send(userName + ' used a streak freeze to maintain their streaks!');
                    people[person][2] = false;
                    people[person][3] = false;

                //Otherwise do it normally
                } else {

                    //If they have a full or half streak divisible by 5 give them a streak freeze
                    var fullDivisor = people[person][0]%5
                    var halfDivisor = people[person][1]%5
                    if (people[person][0] && people[person][2] && !fullDivisor) {
                        client.channels.cache.get(mainChannel).send(userName+' got a full streak of **' + people[person][0] + '** so here\'s a **streak freeze**!');
                        people[person][6] += 1;
                    }
                    if (people[person][0] && people[person][2] && !fullDivisor) {
                        client.channels.cache.get(mainChannel).send(userName+' got a full streak of **' + people[person][0] + '** so here\'s a **streak freeze**!');
                        people[person][6] += 1;
                    }

                    //If they haven't done full workout today, kill full workout streak
                    if (!people[person][2] && people[person][0]) {
                        client.channels.cache.get(mainChannel).send(userName+' lost their full streak of **'+people[person][0]+'**.');
                        people[person][0] = 0;
                    }

                    //If they haven't done half workout today, kill half workout streak
                    if (!people[person][3] && people[person][1]) {
                        client.channels.cache.get(mainChannel).send(userName+' lost their half streak of **'+people[person][1]+'**.');
                        people[person][1] = 0;
                    }

                    people[person][2] = false;
                    people[person][3] = false;
                }
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

function dateCheck(done) {
    var d = new Date();
    time = d.getUTCHours()
    console.log('Still Running, time is : ' + d.toLocaleTimeString() + ' on ' + d.toLocaleDateString() + '. Resetting status : ' + done);
    
    //if it's 2am (time == 8) do the reset and stop it from resetting again
    if (time == 8 && !done) {
        reset();
        console.log('done is true');
        done = true;
    }
    //if it's 3am, tell it, it can reset again once it gets to 2am
    if (time == 9 && done) {
        console.log('done is false');
        done = false
    }

    setTimeout(function(){dateCheck(done, d)}, 60000);
}

//Tells console when bot is turned on
client.on('ready', () => {
    console.log("\n\nThe Bot is Ready");
    var d = new Date();
    console.log(d.getUTCHours());
    console.log(d.toLocaleDateString());
    var done = false;
    //Forever looping to check if the time is right
    dateCheck(done)
});

client.on('messageCreate', (message) => {
    //If a non-bot message is !reset, manually resets
    if (!message.author.bot && message.content === '!reset') {
        reset();
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