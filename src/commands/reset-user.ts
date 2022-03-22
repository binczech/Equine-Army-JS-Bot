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
	if (!hasUserAdminPermission(interaction)) return interaction.reply('Nemáš oprávnění na tento příkaz.');

	const user = interaction.options.getUser('hráč')!;

	const newMoney = await resetUserMoney(user);
	if (isUndefined(newMoney)) {
		return interaction.reply('Reset peněz se nepovedl.');
	}

	return interaction.reply(`Hráči ${user} byly resetovány peníze na částku ${newMoney}.`);
}
