module.exports = {
	name: 'jointrip',
	description: `Shows a list of all of loot tracker's commands`,
	execute(message, args, author) {
    if(trip.people.length === 0) {
      return message.reply(`A trip hasn't been started yet (start one using !starttrip)`);
    }
    
    message.channel.send(``);
	},
};