const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.once('ready', () => {
	console.log('Ready!');
});

/*** WORKFLOW
 * !starttrip [Trip Name] - Notifys chat a trip is about to start
 * !jointrip - Lets the requesting user join a trip.
 * !addloot [Amount (K)] - Adds loot to the trip loot bag 
***/

let loot = [
  /*
    0 => {
      'name': 'Trip Name
      'player': '@username...', (STRING)
      'players': [
        0 => {
          'player': '@username',
          currentLoot: 0,
        }
      ]
    }
  */
];

function createTrip(player, tripName) {
  loot.push({
    'name': tripName,
    'leader': player,
    'players': []
  })

  const tripId = loot.length - 1;

  loot[tripId].players.push({
    'player': {
      'player': player,
      'currentLoot': 0
    }
  })
}

function addLoot(player, stringTotal) {
  const total = Number(stringTotal.slice(0, stringTotal.length - 1));
  loot[player].total += total;
}

function isPlayerOnTrip(checkingPlayer) {
  let foundPlayer = false;

  loot.forEach((trip, index) => {
    loot[index].players.forEach(player => {
      console.log('player:');
      console.log(player);

      if(player['username'] === checkingPlayer['username']) return foundPlayer = true;
    })
  })

  return foundPlayer;
}

function countPlayerOnTrip() {
  let count = 0;

  loot.forEach((trip, index) => {
    if(loot[index].players) {
      count = count + loot[index].players.length;
    }
  })

  return count;
}

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const player = message.author;

  if(command === 'starttrip') {
    const tripName = args;
    if(!tripName.length) {
      return message.reply(`Please enter a name for your trip (!starttrip [Trip Name])`);
    }

    createTrip(player, tripName);
    message.channel.send(`@here, ${player} has started a trip (${tripName}), type !jointrip to join in`);
  }
  else if(command === 'jointrip') {
    if(!loot.length) {
      return message.reply(`no trips have been setup yet (create your own using !starttrip [Trip Name])`);
    }
    
    if(isPlayerOnTrip(player)) {
      return message.reply(`You are already on this trip!`);
    }

    loot[0].players.push({
      'player': {
        'player': player,
        'currentLoot': 0
      }
    })

    message.channel.send(`${player} has joined the trip (${countPlayerOnTrip()} people have joined)`);
  }
  /*if (command === 'loottracker') {
		message.channel.send(`-- Loot Tracker - Commands --`);
		message.channel.send(`- !loot [Loot Worth (K)] IE: (!loot 560K)`);
  }
	else if (command === 'loot') {
    addLoot(player, args[0]);

    message.channel.send(`Adding loot to bag for ${player}, total loot: ${loot[player].total}K`);
    if(loot.length >= 1) {
      message.channel.send(`Total Loot:`);
      loot.forEach(function(data, player) {
        console.log('player: ', player, data);
        message.channel.send(`${player} has looted ${data.total}K`);
      })
    }
  }
  else if(command === 'endtrip') {
		message.channel.send(`-- Ending Trip --`);
  }*/
});


client.login(token);