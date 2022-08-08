const {SlashCommandBuilder} = require('discord.js');
const fs = require('fs');

module.exports = {
    // command info
    data: new SlashCommandBuilder()
        .setName("leaderboard")
        .setDescription("displays leaderboard of everyone's total workouts"),
    
    // runs command
    async execute(interaction) {
        fs.readFile("./people.json", "utf8", (err, jsonString) => {

            if (err) {
                console.log("File read failed from leaderboard :", err);
                return;
            }

            try{
                //parse json file
                const people = JSON.parse(jsonString)

                //sets up array to order people for sorting
                var order = [];

                //Fills order randomly
                for(const person in people) {
                    order.push(person);
                }

                //Sorts order
                let n = order.length;
                for (let i = 1; i < n; i++) {

                    // Choosing the first element in our unsorted subarray
                    let current = order[i];
                    // The last element of our sorted subarray
                    let j = i-1; 
                    while ((j > -1) && (people[current][7] < people[order[j]][7])) {
                        order[j+1] = order[j];
                        j--;
                    }
                    order[j+1] = current;
                }

                //print full workout leaderboard
                replyMessage = '**The Full Workout Leaderboard Is : **'
                var length = order.length;
                for (var i = 0; i < length; i++) {
                    console.log(order);
                    replyMessage = replyMessage + '\n\t**' + (i+1) + '** : **' + people[order[length-i-1]][4] + '** with **' + people[order[length-i-1]][7] + '** full total workouts!';
                }

                for (let i = 1; i < n; i++) {
                    // Choosing the first element in our unsorted subarray
                    let current = order[i];
                    // The last element of our sorted subarray
                    let j = i-1; 
                    while ((j > -1) && (people[current][8] < people[order[j]][8])) {
                        order[j+1] = order[j];
                        j--;
                    }
                    order[j+1] = current;
                }

                //print half workout leaderboard
                replyMessage = replyMessage + '\n\n**The Half Workout Leaderboard Is : **'
                var length = order.length;
                for (var i = 0; i < length; i++) {
                    replyMessage = replyMessage + '\n\t**' + (i+1) + '** : **' + people[order[length-i-1]][4] + '** with **' + people[order[length-i-1]][8] + '** half total workouts!';
                }


            } catch (err) {
                console.log("Error parsing JSON string:", err);
            }
        });
        await setTimeout(function(){interaction.reply(replyMessage)}, 100);
    }
}