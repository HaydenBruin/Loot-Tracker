module.exports = {
	name: 'starttrip',
	description: `Lets people start a trip and notify the discord server`,
	execute(message, args, author) {
    if(trip.people.length >= 1) {
      return message.reply('There is already a trip in progress (use !et to end the trip)');
    }
    
    message.channel.send(`@here, ${author} has started a trip, type !jt to join in`);
	},
};