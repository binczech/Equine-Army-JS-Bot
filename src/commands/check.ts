import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { isUndefined } from 'lodash/fp';
import { getUser } from '../firebase';
import { hasUserAdminPermission } from '../utils/has-user-permission';

export const data = new SlashCommandBuilder()
	.setName('kontrola')
	.setDescription('Vypíše peníze konkrétního hráče.')
	.addUserOption((option) =>
		option
			.setName('hráč')
			.setDescription('Hráč, kterého peníze se vypíšou')
			.setRequired(true),
	);

export async function execute(interaction: CommandInteraction) {
	if (!hasUserAdminPermission(interaction)) return interaction.reply('Nemáš oprávnění na tento příkaz.');

	const user = interaction.options.getUser('hráč')!;

	const userData = await getUser(user);

	if (isUndefined(userData)) {
		return interaction.reply('Výpis peněz se nepovedl.');
	}

	return interaction.reply(`Hráč ${user} má ${userData.money} peněz.`);
}
