const {SlashCommandBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
    // command info
    data: new SlashCommandBuilder()
        .setName("log-workout")
        .setDescription("logging workout"),
    
    // runs command
    async execute(interaction) {
        var replyMessage = 'there was an issue';
        //Then read people.json
        fs.readFile("./people.json", "utf8", (err, jsonString) => {
            const personName = interaction.user;
            const channel = interaction.channel_id
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {

                //Parse people.json
                const people = JSON.parse(jsonString)

                //If the message sender is a key value, send the contents of that key
                if (people[personName]) {

                    //Makes sure they haven't already gained a day streak for the day
                    if (!people[personName][2]) {
                        //Increases that persons score
                        people[personName][0]++;
                        if (!people[personName][3]) {
                            people[personName][1]++;
                        }
                        people[personName][2] = true;
                        people[personName][3] = true;
                        people[personName][4] = interaction.user.username;
                        console.log(people[personName]);

                        //Writes the increase in score to the file and updates them
                        fs.writeFile("./people.json", JSON.stringify(people, null, 4), err => {
                            if (err) console.log("Error writing file:", err);
                        });
                        replyMessage = people[personName][4]+' has a full streak of **'+people[personName][0]+'**.\nAnd a half streak of **'+people[personName][1]+'**.'; 
                    
                    //Lets them know if they've already logged for the day
                    } else {
                        replyMessage = 'You\'ve already done your workout for today, so you\'re streak is safe!';
                    }
                
                //If not, add it to the file
                } else {
                    replyMessage = interaction.user.username+' is not in the database yet, adding it now. \nYour full streak is **1**.\nYour half streak is **1**';
                    
                    //start off their score at one, and create it and stringify
                    var name = interaction.user.username;
                    personSetup = [1, 1, true, true, name];
                    people[personName] = personSetup;
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
        await setTimeout(function(){interaction.reply(replyMessage)}, 10);
    }
}