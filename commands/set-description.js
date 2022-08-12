const {SlashCommandBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
    // command info
    data: new SlashCommandBuilder()
        .setName("set-description")
        .setDescription("Enter with text to set your description!")

        //Parameter for getting their description.
        .addStringOption(option => option
            .setName('description')
            .setDescription('Type your description here')
            .setRequired(true)
        )

        //Paramater for whether or not they want it public
        .addStringOption(option => option
            .setName('public')
            .setDescription('Do you want it to be public?')
            .setRequired(true)
            .addChoices(
                { name: 'Yes', value : 'true'}, 
                { name: 'No', value : 'false'}
            )
        ),
    
    // runs command
    async execute(interaction) {
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
                
                if (people[person]) {
                    //Parse people.json
                    const people = JSON.parse(jsonString);

                    const description = interaction.options.getString('description');
                    const publicity = interaction.options.getString('public');
                    
                    people[person][10] = description;
                    if (publicity === 'true') {
                        people[person][9] = true;
                        replyMessage = people[person][4] + ', your description is public and is set to \"' + description + '\".';
                    } else {
                        people[person][9] = false;
                        replyMessage = people[person][4] + ', your description is private (But has been updated).';
                    }

                    fs.writeFile("./people.json", JSON.stringify(people, null, 4), err => {
                        if (err) console.log("Error writing file:", err);
                    });
                } else {
                    replyMessage = 'Please setup your profile with /log-workout or /half-workout';
                }
                   
            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
        await setTimeout(function(){interaction.reply(replyMessage)}, 10);
    }
}