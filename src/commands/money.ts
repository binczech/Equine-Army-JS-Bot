import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { isUndefined } from 'lodash/fp';
import { getUser } from '../firebase';

export const data = new SlashCommandBuilder()
	.setName('penize')
	.setDescription('Vypíše aktuální stav konta hráče.');

export async function execute(interaction: CommandInteraction) {
	const userData = await getUser(interaction.user);
	if (isUndefined(userData)) {
		return interaction.reply('Výpis stavu konta se nepovedl.');
	}

	return interaction.reply(`Hráč ${interaction.user} má ${userData.money} peněz.`);
}
