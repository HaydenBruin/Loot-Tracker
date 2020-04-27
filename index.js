const Discord = require('discord.js');
const client = new Discord.Client();
const { prefix, token } = require('./config.json');

client.once('ready', () => {
	console.log('Ready!');
});

client.on('message', message => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();

	if (command === 'loot') {
		message.channel.send('-- Adding Loot --');
		message.channel.send('');
		message.channel.send('');
		message.channel.send('');
		message.channel.send('');
	}
  
  message.channel.send(`Command name: ${command}\nArguments: ${args}`);
});


client.login(token);