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
	// Checks if user has permission for this command
	if (!hasUserAdminPermission(interaction)) return interaction.reply('Nemáš oprávnění na tento příkaz.');

	// Gets arguments from the command
	const amount = interaction.options.getInteger('částka')!;

	// Sets the starting money
	const newStartMoney = await setStartingMoney(amount);
	// Checks if the money was set
	if (isUndefined(newStartMoney)) {
		return interaction.reply('Nastavení startovní částky se nepovedlo.');
	}

	// Sends a message to the channel
	return interaction.reply(`Hodnota startovních peněz změněna na ${newStartMoney}.`);
}
