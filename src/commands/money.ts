import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { isUndefined } from 'lodash/fp';
import { getUser } from '../firebase';

export const data = new SlashCommandBuilder()
	.setName('penize')
	.setDescription('Vypíše aktuální stav konta hráče.');

export async function execute(interaction: CommandInteraction) {
	// Gets the user from the database
	const userData = await getUser(interaction.user);

	// Checks if data was found
	if (isUndefined(userData)) {
		return interaction.reply('Výpis stavu konta se nepovedl.');
	}

	// Sends a message to the channel
	return interaction.reply(`Hráč ${interaction.user} má ${userData.money} peněz.`);
}
