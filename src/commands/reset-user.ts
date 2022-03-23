import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { isUndefined } from 'lodash/fp';
import { resetUserMoney } from '../firebase';
import { hasUserAdminPermission } from '../utils/has-user-permission';

export const data = new SlashCommandBuilder()
	.setName('reset')
	.setDescription('Resetuje peníze hráče na startovní hodnotu peněz.')
	.addUserOption((option) =>
		option
			.setName('hráč')
			.setDescription('Hráč, kterému se resetují peníze')
			.setRequired(true),
	);

export async function execute(interaction: CommandInteraction) {
	// Checks if user has permission for this command
	if (!hasUserAdminPermission(interaction)) return interaction.reply('Nemáš oprávnění na tento příkaz.');

	// Gets arguments from the command
	const user = interaction.options.getUser('hráč')!;

	// Resets the user's money
	const newMoney = await resetUserMoney(user);
	// Checks if the money was reset
	if (isUndefined(newMoney)) {
		return interaction.reply('Reset peněz se nepovedl.');
	}

	// Sends a message to the channel
	return interaction.reply(`Hráči ${user} byly resetovány peníze na částku ${newMoney}.`);
}
