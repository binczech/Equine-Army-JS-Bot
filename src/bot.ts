import { Client } from 'discord.js';

import config from './config';
import * as commandModules from './commands';
import { toggleRole } from './reactions';

const commands = Object(commandModules);

export const client = new Client({
	intents: ['GUILDS', 'GUILD_MEMBERS', 'GUILD_MESSAGES', 'DIRECT_MESSAGES', 'GUILD_MESSAGE_REACTIONS'],
	partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.once('ready', () => {
	console.log('Discord bot ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) {
		return;
	}
	const { commandName } = interaction;
	commands[commandName]?.execute(interaction, client);
});

client.on('messageReactionAdd', async (reaction, user) => {
	toggleRole(reaction, user);
});

client.on('messageReactionRemove', async (reaction, user) => {
	toggleRole(reaction, user, false);
});

client.login(config.DISCORD_TOKEN);
