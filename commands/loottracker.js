module.exports = {
	name: 'loottracker',
	description: `Shows a list of all of loot tracker's commands`,
	execute(message, args, author) {
    let commands = "";
    commands += `!al [Loot Amount] - Adds loot to the loot table\n`;
    commands += `!rl [Loot Amount] - Removes loot from the loot table\n`;
    commands += `!et - Ends the current trip and splits up the loot money\n`;
    //commands += `!starttrip - Starts a trip (notifys the discord server)\n`;
    //commands += `!jointrip - Joins the trip, adds you to the loot table with 0k\n`;
    message.channel.send(commands);
	},
};