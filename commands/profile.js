const {SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
    // command info
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Lists your own (default) or another person's profile")
        .addStringOption(option => option
            .setName('person')
            .setDescription('Who\'s profile do you want to see? (@ them here)')
            .setRequired(false)
        ),
    
    // runs command
    async execute(interaction, client) {
        //Reads the file
        fs.readFile("./people.json", "utf8", (err, jsonString) => {
            replyMessage = 'there was an error streak freeze'
            if (err) {
                console.log("File read failed:", err);
                return;
            }
            try {
                //Parse people.json
                const people = JSON.parse(jsonString);
                var description = '';
                var streakActive = '';
                var fieldVal = '';
                var replyStreaks = '';
                var resetNum = 5;

                var person = interaction.user;
                console.log(person);
                avatar = interaction.user.avatarURL();
                var name = interaction.user.username;

                var chosenPerson = interaction.options.getString('person')
                console.log(chosenPerson);
                if (chosenPerson) {
                    person = chosenPerson.replace('!','');
                    name = people[person][4];
                    avatar = 'https://preview.redd.it/f2cmqxf6lnq21.jpg?width=640&crop=smart&auto=webp&s=e077a809cfc5d2c84a009f0205086d5e3ce4787d';
                }

                //Makes sure the person u chose exists
                if (people[person]) {
                    if (people[person][9]) {
                        description = people[person][10];
                    } else {
                        description = 'Description set to private';
                    }
                    if (people[person][5]) {
                        streakActive = 'Streak Freeze in use';
                    } else {
                        streakActive = 'Streak Freeze not in use';
                    }

                    //Displays full streak
                    if (people[person][0]%resetNum === 0) {
                        if (people[person][2]) {
                            replyStreaks = replyStreaks+'  Full streak **'+people[person][0]+'** : :green_square: :green_square: :green_square: :green_square: :green_square: ';
                        } else {
                            replyStreaks = replyStreaks+'  Full streak **'+people[person][0]+'** : :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: ';
                        }
                    } else {
                        replyStreaks = replyStreaks+'  Full streak **'+people[person][0]+'** : ';
                        for (var i = 0; i < people[person][0]%resetNum; i++) {        
                            replyStreaks = replyStreaks + ':green_square: '
                        }
                        for (var i = 0; i < resetNum - people[person][0]%resetNum; i++) {
                            replyStreaks = replyStreaks + ':white_square_button: '
                        }
                    }

                    //Displays full workout today
                    if (people[person][2]) {
                        replyStreaks += '\nFull workout completed today.\n'
                    } else {
                        replyStreaks += '\nFull workout not completed today.\n'
                    }

                    //displays half streak
                    if (people[person][1]%resetNum === 0) {
                        if (people[person][3]) {
                            replyStreaks = replyStreaks+' Half streak **'+people[person][1]+'** : :green_square: :green_square: :green_square: :green_square: :green_square: ';
                        } else {
                            replyStreaks = replyStreaks+' Half streak **'+people[person][1]+'** : :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: ';
                        }
                    } else {
                        replyStreaks = replyStreaks+'Half streak **'+people[person][1]+'** : ';
                        for (var i = 0; i < people[person][1]%resetNum; i++) {        
                            replyStreaks = replyStreaks + ':green_square: '
                        }
                        for (var i = 0; i < resetNum - people[person][1]%resetNum; i++) {
                            replyStreaks = replyStreaks + ':white_square_button: '
                        }
                    }

                    //Displays full workout today
                    if (people[person][3]) {
                        replyStreaks += '\nHalf workout completed today.\n'
                    } else {
                        replyStreaks += '\nHalf workout not completed today.\n'
                    }

                    fieldVal += replyStreaks;

                    const exampleEmbed = new EmbedBuilder()
                        .setColor(0x523675)
                        .setTitle(name)
                        .setDescription(description)
                        .setThumbnail(avatar)
                        .addFields(
                            { name: 'Streaks : ', value: fieldVal },
                            { name: streakActive, value: 'Streak Freezes : **' + people[person][6] + '**', inline: true },
                            { name: 'Full workouts done : ' + people[person][7], value: '**Half workouts done : ' + people[person][8] + '**', inline: true },
                        )
                        .setTimestamp()

                        replyMessage = { embeds: [exampleEmbed]}

                //In case the chosen person isn't in the database
                } else {
                    replyMessage = 'I\'m sorry, that person is not in our database';
                }


            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
        await setTimeout(function(){interaction.reply(replyMessage)}, 10);
    }
}