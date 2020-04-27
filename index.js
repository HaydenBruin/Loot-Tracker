const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.once('ready', () => {
	console.log('Ready!');
});

let loot = [];

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

  if (command === 'loottracker') {
		message.channel.send(`-- Loot Tracker - Commands --`);
		message.channel.send(`- !loot [Loot Worth (K)] IE: (!loot 560K)`);
  }
	else if (command === 'loot') {
		message.channel.send(`-- Adding Loot --`);
		message.channel.send(`Looting bag for ${message.author}`);
    
    loot[message.author]['total'] += args[0];
    message.channel.send(`Loot Total: ${loot[message.author]['total']}`);
  }
  else if(command === 'endtrip') {
		message.channel.send(`-- Ending Trip --`);
  }
});


client.login(token);