const {SlashCommandBuilder} = require('discord.js');
const fs = require('fs');

//Called later on to send a message and get reactions
async function message(interaction, client, jsonString) {
    //setup
    const channel = interaction.channelId;
    const person = interaction.user;
    const people = JSON.parse(jsonString);

    //Sends a message and reacts to it
    const message = await client.channels.cache.get(channel).send('Would you like your workout description to be public?\n(defaults to no)');
    message.react('✅')
        .then(() => message.react('❌'))
        .catch(error => console.error('One of the emojis failed to react:', error));

    const filter = (reaction, user) => {
        return ['✅', '❌'].includes(reaction.emoji.name) && user.id === interaction.user.id;
    };
    
    message.awaitReactions({ filter, max: 1, time: 30000, errors: ['time'] })
        .then(collected => {
            const reaction = collected.first();
    
            if (reaction.emoji.name === '✅') {

                //if true, removes, all reactions and changes the message
                message.reactions.removeAll()
                    .catch(error => console.error('Failed to clear reactions:', error));
                message.edit('OK, your description will be public.\nRemember you can change this any time with /description-toggle');

                //then sets the value to true and updates the file
                people[person][9] = true
                const jsonString = JSON.stringify(people, null, 4);
                fs.writeFile('./people.json', jsonString, err => {
                    if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file from message command in half workout')
                    }
                })
                
            } else {

                //if they choose the x, removes, all reactions and changes the message
                message.reactions.removeAll()
                    .catch(error => console.error('Failed to clear reactions:', error));
                message.edit('OK, your description will be hidden.\nRemember you can change this any time with /description-toggle');

                //then sets the value to false and updates file
                people[person][9] = false;
                const jsonString = JSON.stringify(people, null, 4);
                fs.writeFile('./people.json', jsonString, err => {
                    if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file 2')
                    }
                })
            }
        })
}

module.exports = {
    // command info
    data: new SlashCommandBuilder()
        .setName("half-workout")
        .setDescription("logs a half workout"),
    
    // runs command
    async execute(interaction, client) {
        var replyMessage = 'there was an issue';
        //Then read people.json
        fs.readFile("./people.json", "utf8", (err, jsonString) => {
            const person = interaction.user;
            var name = interaction.user.username;
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {

                //Parse people.json
                const people = JSON.parse(jsonString);

                //If the message sender is a key value, send the contents of that key
                if (people[person]) {

                    //Makes sure they haven't already gained a day streak for the day
                    if (!people[person][3]) {
                        //Increases that persons score
                        people[person][1]++;
                        people[person][8]++;
                        people[person][2] = true;
                        people[person][4] = name;
                        console.log(people[person]);

                        //Writes the increase in score to the file and updates them
                        fs.writeFile("./people.json", JSON.stringify(people, null, 4), err => {
                            if (err) console.log("Error writing file:", err);
                        });
                        replyMessage = people[person][4]+' has a full streak of **'+people[person][0]+'**.\nAnd a half streak of **'+people[person][1]+'**.'; 
                    
                    //Lets them know if they've already logged for the day
                    } else {
                        replyMessage = 'You\'ve already done at least half your workout for today, so your half streak is safe!';
                    }
                
                //If not, add it to the file
                } else {
                    replyMessage = 'Looks like you\'re new, '+name+'.\nYou\'ve been added to the database. \nYour full streak is **0**.\nYour half streak is **1**';
                    
                    //start off their score at one, and create it and stringify
                    personSetup = [0, 1, false, true, name, false, 0, 1, 1, false, "This is where you'd put your description"];
                    people[person] = personSetup;
                    const jsonString = JSON.stringify(people, null, 4);

                    message(interaction, client, jsonString);
                    
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
        await setTimeout(function(){interaction.reply(replyMessage)}, 10);
    }
}