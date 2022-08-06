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
            const printName = interaction.user.username;
            const channel = interaction.channel_id
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {
                console.log("it works up to 1");
                //Parse people.json
                const people = JSON.parse(jsonString)

                //If the message sender is a key value, send the contents of that key
                if (people[personName]) {
                    console.log("it works up to 2");
                    //Increases that persons score
                    people[personName]++;
                    console.log(people[personName]);

                    //Writes the increase in score to the file
                    fs.writeFile("./people.json", JSON.stringify(people, null, 4), err => {
                        if (err) console.log("Error writing file:", err);
                    });
                    console.log("It really should be working 2");
                    replyMessage = printName+' has a score of '+people[personName]; 
                    console.log(replyMessage);

                //If not, add it to the file
                } else {
                    console.log("it works up to 3");
                    replyMessage = printName+' is not in the database yet, adding it now, your score is 1';
                    console.log(replyMessage);

                    //start off their score at one, and create it and stringify
                    people[personName] = 1;
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
            console.log(replyMessage+' number 2');
        });
        console.log(replyMessage+" number 3");
        await setTimeout(function(){interaction.reply(replyMessage)}, 10);
    }
}