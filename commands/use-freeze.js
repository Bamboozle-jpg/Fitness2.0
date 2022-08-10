const {SlashCommandBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
    // command info
    data: new SlashCommandBuilder()
        .setName("use-freeze")
        .setDescription("Uses a streak freeze, to freeze your streak for a day"),
    
    // runs command
    async execute(interaction) {
        //Reads the file
        fs.readFile("./people.json", "utf8", (err, jsonString) => {
            const person = interaction.user;
            var name = interaction.user.username;
            replyMessage = 'there was an error streak freeze'
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            console.log(jsonString)
            try {
                //Parse people.json
                const people = JSON.parse(jsonString);

                //if they have streak freezes, use one
                if (people[person][6] && !people[person][5]) {
                    people[person][5] = true;
                    people[person][6] -= 1;
                    replyMessage = name + ', your streak freeze is now active. You have ' + people[person][6] + ' streak freezes left.';

                //Otherwise tell them why they can't use one
                } else if (!people[person][6]) {
                    replyMessage = 'Sorry, you don\'t have any streak freezes to use';
                } else if (people[person][5]) {
                    replyMessage = 'You already have a streak freeze active';
                } else {
                    replyMessage = 'Something went wrong';
                }

                //Write to file
                jsonString = JSON.stringify(people, null, 4);
                fs.writeFile('./people.json', jsonString, err => {
                    if (err) {
                        console.log('Error writing file', err)
                    } else {
                        console.log('Successfully wrote file from message command in half workout')
                    }
                })

            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
        await setTimeout(function(){interaction.reply(replyMessage)}, 10);
    }
}