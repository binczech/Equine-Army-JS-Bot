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
	// Checks if user has permission for this command
	if (!hasUserAdminPermission(interaction)) return interaction.reply('Nemáš oprávnění na tento příkaz.');

	// Gets arguments from the command
	const user = interaction.options.getUser('hráč')!;

	// Gets the user from the database
	const userData = await getUser(user);

	// Checks if data was found
	if (isUndefined(userData)) {
		return interaction.reply('Výpis peněz se nepovedl.');
	}

	// Sends a message to the channel
	return interaction.reply(`Hráč ${user} má ${userData.money} peněz.`);
}
