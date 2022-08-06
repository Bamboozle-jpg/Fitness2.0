const {SlashCommandBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
    // command info
    data: new SlashCommandBuilder()
        .setName("half-workout")
        .setDescription("logging half workout"),
    
    // runs command
    async execute(interaction) {
        var replyMessage = 'there was an issue';
        //Then read people.json
        fs.readFile("./people.json", "utf8", (err, jsonString) => {
            const personName = interaction.user;
            const printName = interaction.user.username;
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
                    if (!people[personName][3]) {
                        //Increases that persons score
                        people[personName][1]++;
                        people[personName][3] = true;
                        console.log(people[personName]);

                        //Writes the increase in score to the file and updates them
                        fs.writeFile("./people.json", JSON.stringify(people, null, 4), err => {
                            if (err) console.log("Error writing file:", err);
                        });
                        replyMessage = printName+' has a full streak of **'+people[personName][0]+'**.\nAnd a half streak of **'+people[personName][1]+'**.'; 
                    
                    //Lets them know if they've already logged for the day
                    } else {
                        replyMessage = 'You\'ve already done at least half your workout for today, so you\'re streak is safe!';
                    }
                
                //If not, add it to the file
                } else {
                    replyMessage = printName+' is not in the database yet, adding it now. \nYour full streak is **0**.\nYour half streak is **1**';



                    //start off their score at one, and create it and stringify
                    personSetup = [0, 1, false, true];
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