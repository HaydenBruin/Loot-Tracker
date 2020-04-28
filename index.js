const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

/*
!al [Loot] - add loot
!et - ends the current trip
*/

client.once('ready', () => {
  resetTripData();
	console.log('Ready!');
});

let trip;

function resetTripData() {
  trip = {
    people: []
  }
}

function isNewPlayerToTrip(player) {
  let isNewPlayerToTrip = true;

  if(trip.people.length) {
    trip.people.forEach(person => {
      if(person.user['username'] == player['username']) {
        isNewPlayerToTrip = false;
      }
    })
  }

  return isNewPlayerToTrip;
}

function getIndexOfPerson(player) {
  let index = -1;

  if(trip.people.length) {
    trip.people.forEach((person, key) => {
      if(person.user['username'] == player['username']) {
        index = key;
      }
    });
  }

  return index;
}

function calculateTotalLoot() {
  let totalLoot = 0;

  if(trip.people.length) {
    trip.people.forEach((person, key) => {
      totalLoot = totalLoot + person.currentLoot;
    });
  }

  return totalLoot;
}

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const author = message.author;

  if (command === 'al') {
    if(!args[0]) {
      return message.reply('You need to include a loot amount (!al 550k)');
    }

    if(!args[0].match(/\d+k/i)) {
      return message.reply('You need to submit loot in a thousands format (!al 550k, !al 120k)');
    }

    const newLootString = args[0];
    const newLootNumeric = Number(newLootString.slice(0, newLootString.length - 1));

    if(isNewPlayerToTrip(author)) {
      trip.people.push({
        user: author,
        currentLoot: newLootNumeric
      })
    }
    else {
      const personId = getIndexOfPerson(author); 
      const person = trip.people[personId];

      person.currentLoot = person.currentLoot + newLootNumeric;
    }

    message.channel.send(`${message.author.toString()} has added ${newLootNumeric}K`);
    message.channel.send(`-- Loot Table Update --`);
    trip.people.forEach((person, key) => {
      message.channel.send(`${person.user['username']}: ${person.currentLoot}K`);
    });
    message.channel.send(`@here, total loot bag now sits at ${calculateTotalLoot()}K`);
  }
  else if(command === 'et') {
    if(!trip.people.length) {
      return message.reply('No trip has been started, type !al [Loot Amount (560k)] to start a trip');
    }

    const totalPeopleOnTrip = trip.people.length;

    message.channel.send(`@here, the ${totalPeopleOnTrip} man trip has ended, ${calculateTotalLoot()}K loot table is as follows:`);
    trip.people.forEach((person, key) => {
      message.channel.send(`${person.user['username']} has ${person.currentLoot}K total (split is ${(person.currentLoot / totalPeopleOnTrip).toFixed(0)}K)`);
    });

    resetTripData();
  }
});

client.login(token);