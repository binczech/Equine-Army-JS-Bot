import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { isUndefined } from 'lodash/fp';
import { changeUserMoney } from '../firebase';
import { hasUserAdminPermission } from '../utils/has-user-permission';

export const data = new SlashCommandBuilder()
	.setName('odebrat')
	.setDescription('Odebere hráči peníze.')
	.addUserOption((option) =>
		option
			.setName('hráč')
			.setDescription('Hráč, kterému se odeberou peníze')
			.setRequired(true),
	)
	.addIntegerOption((option) =>
		option
			.setName('částka')
			.setDescription('Částka, která se hráčovi odebere')
			.setRequired(true)
			.setMinValue(0),
	);

export async function execute(interaction: CommandInteraction) {
	// Checks if user has permission for this command
	if (!hasUserAdminPermission(interaction)) return interaction.reply('Nemáš oprávnění na tento příkaz.');

	// Gets arguments from the command
	const money = interaction.options.getInteger('částka')!;
	const user = interaction.options.getUser('hráč')!;

	// Removes money from the user
	const newMoney = await changeUserMoney(user, -money);
	// Checks if the money was removed
	if (isUndefined(newMoney)) {
		return interaction.reply('Odebrání peněz se nepovedlo.');
	}

	// Sends a message to the channel
	return interaction.reply(`Hráči ${user} bylo odebráno ${money} peněz. Nyní má ${newMoney} peněz.`);
}
