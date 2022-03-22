import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { isUndefined } from 'lodash/fp';
import { setStartingMoney } from '../firebase';
import { hasUserAdminPermission } from '../utils/has-user-permission';

export const data = new SlashCommandBuilder()
	.setName('pripsatstart')
	.setDescription('Nastaví hodnotu startovních, kterou bude mít hráč na začátku.')
	.addIntegerOption((option) =>
		option
			.setName('částka')
			.setDescription('Startovní částka na začátku')
			.setRequired(true)
			.setMinValue(0),
	);

export async function execute(interaction: CommandInteraction) {
	if (!hasUserAdminPermission(interaction)) return interaction.reply('Nemáš oprávnění na tento příkaz.');

	const amount = interaction.options.getInteger('částka')!;

	const newStartMoney = await setStartingMoney(amount);
	if (isUndefined(newStartMoney)) {
		return interaction.reply('Nastavení startovní částky se nepovedlo.');
	}

	return interaction.reply(`Hodnota startovních peněz změněna na ${newStartMoney}.`);
}
