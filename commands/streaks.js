const {SlashCommandBuilder} = require('discord.js');
const fs = require('fs');
const resetNum = 5


module.exports = {
    // command info
    data: new SlashCommandBuilder()
        .setName("streaks")
        .setDescription("shows streaks leaderboard"),
    
    // runs command
    async execute(interaction, forward) {
        var replyMessage = '';

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
                for(const person in people) {
                    userName = people[person][4]

                    //displays one person's full streak
                    if (people[person][0]%resetNum === 0) {
                        if (people[person][2]) {
                            replyMessage = replyMessage+userName+' Full streak **'+people[person][0]+'** : :green_square: :green_square: :green_square: :green_square: :green_square: ';
                        } else {
                            replyMessage = replyMessage+userName+' Full streak **'+people[person][0]+'** : :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: ';
                        }
                    } else {
                        replyMessage = replyMessage+userName+' Full streak **'+people[person][0]+'** : ';
                        for (var i = 0; i < people[person][0]%resetNum; i++) {        
                            replyMessage = replyMessage + ':green_square: '
                        }
                        for (var i = 0; i < (resetNum - people[person][0])%resetNum; i++) {
                            replyMessage = replyMessage + ':white_square_button: '
                        }
                    }
                    replyMessage = replyMessage+'\n'

                    //displays one person's half streak
                    if (people[person][1]%resetNum === 0) {
                        if (people[person][3]) {
                            replyMessage = replyMessage+userName+' Full streak **'+people[person][1]+'** : :green_square: :green_square: :green_square: :green_square: :green_square: ';
                        } else {
                            replyMessage = replyMessage+userName+' Full streak **'+people[person][1]+'** : :white_square_button: :white_square_button: :white_square_button: :white_square_button: :white_square_button: ';
                        }
                    } else {
                        replyMessage = replyMessage+userName+' Full streak **'+people[person][1]+'** : ';
                        for (var i = 0; i < people[person][1]%resetNum; i++) {        
                            replyMessage = replyMessage + ':green_square: '
                        }
                        for (var i = 0; i < (resetNum - people[person][1])%resetNum; i++) {
                            replyMessage = replyMessage + ':white_square_button: '
                        }
                    }

                    replyMessage = replyMessage+'\n\n'
                }
                
            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
        await setTimeout(function(){interaction.reply(replyMessage)}, 450);
    }
}