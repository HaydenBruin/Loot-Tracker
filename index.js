const fs = require('fs');
const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
const { prefix, token } = require('./config.json');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

client.once('ready', () => {
  resetTripData();
});

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

function shouldAddS(value) {
  return value === 1 ? "" : "s";
}

function calculateTotals() {
  let totalLoot = 0;
  let totalBags = 0;

  if(trip.people.length) {
    trip.people.forEach((person, key) => {
      totalLoot = totalLoot + person.currentLoot;
      totalBags = totalBags + person.bags;
    });
  }

  return {
    totalLoot: totalLoot,
    totalBags: totalBags
  }
}

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift().toLowerCase();
  const author = message.author;

  if (command === 'loottracker') {
    client.commands.get('loottracker').execute(message, args, author);
  }

  if (command === 'al') {
    if(!args[0]) {
      return message.reply('You need to include a loot amount (!al 550k)');
    }

    if(!args[0].match(/\d+k/i)) {
      return message.reply('You need to submit loot in a thousands format (!al 550k, !al 120k)');
    }

    const newLootString = args[0];
    const newLootNumeric = Number(newLootString.slice(0, newLootString.length - 1));

    if(newLootNumeric <= 0) {
      return message.reply('Your loot value needs to be over 0k  (use !rl [Loot Amount] to remove loot)');
    }

    if(isNewPlayerToTrip(author)) {
      trip.people.push({
        user: author,
        currentLoot: newLootNumeric,
        bags: 1,
      })
    }
    else {
      const personId = getIndexOfPerson(author); 
      const person = trip.people[personId];

      person.currentLoot = person.currentLoot + newLootNumeric;
      person.bags = person.bags + 1;
    }

    let channelUpdate = "";
    const totalValues = calculateTotals();

    channelUpdate += `${message.author.toString()} has added ${newLootNumeric}k\n\n`;
    channelUpdate += `-- Loot Table --\n`;
    trip.people.forEach((person, key) => {
      channelUpdate += `${person.user['username']}: ${person.currentLoot}k (${person.bags} bag${person.bags == 1 ? "" : "s"})\n`;
    });
    channelUpdate += `\nTotal loot bag now sits at ${totalValues.totalLoot}k (${totalValues.totalBags} bag${shouldAddS(totalValues.totalBags)}) - Current split value is ${totalValues.totalLoot / trip.people.length}k`;

    message.channel.send(channelUpdate);
  }
  else if(command === 'rl') {
    if(!args[0]) {
      return message.reply('You need to include a loot amount (!rl -550k)');
    }

    if(!args[0].match(/\d+k/i)) {
      return message.reply('You need to submit loot in a thousands format (!rl -550k, !rl -120k)');
    }

    const newLootString = args[0];
    const newLootNumeric = Number(newLootString.slice(0, newLootString.length - 1));

    if(newLootNumeric <= 0) {
      return message.reply(`The amount of loot you're removing needs to be over 0k`);
    }

    if(isNewPlayerToTrip(author)) {
      return message.reply(`You don't have any loot to remove`);
    }
    else {
      const personId = getIndexOfPerson(author); 
      const person = trip.people[personId];

      person.currentLoot = person.currentLoot - newLootNumeric;

      if(person.currentLoot < 0) {
        person.currentLoot = 0;
      }
    }

    let channelUpdate = "";
    const totalValues = calculateTotals();

    channelUpdate += `${message.author.toString()} has removed ${newLootNumeric}k\n\n`;
    channelUpdate += `-- Loot Table --\n`;
    trip.people.forEach((person, key) => {
      channelUpdate += `${person.user['username']}: ${person.currentLoot}k\n`;
    });
    channelUpdate += `\n@here, total loot bag now sits at ${totalValues.totalLoot}k (${totalValues.totalBags} bag${shouldAddS(totalValues.totalBags)})`;

    message.channel.send(channelUpdate);
  }
  else if(command === 'et') {
    if(!trip.people.length) {
      return message.reply('No trip has been started, type !al [Loot Amount (560k)] to start a trip');
    }

    let channelUpdate = "";
    const totalPeopleOnTrip = trip.people.length;
    const totalValues = calculateTotals();

    channelUpdate += `@here, the ${totalPeopleOnTrip} man trip has ended\n\n`;
    trip.people.forEach((person, key) => {
      channelUpdate += `${person.user['username']} has ${person.currentLoot}k total from ${person.bags} bag${person.bags == 1 ? "" : "s"} (split is ${(person.currentLoot / totalPeopleOnTrip).toFixed(0)}k)\n`;
    });
    channelUpdate += `\nThe total trip loot was ${totalValues.totalLoot}k (${totalValues.totalBags} bag${shouldAddS(totalValues.totalBags)})`
    message.channel.send(channelUpdate);

    resetTripData();
  }
});

client.login(token);