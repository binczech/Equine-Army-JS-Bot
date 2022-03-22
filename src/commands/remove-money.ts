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
	if (!hasUserAdminPermission(interaction)) return interaction.reply('Nemáš oprávnění na tento příkaz.');

	const money = interaction.options.getInteger('částka')!;
	const user = interaction.options.getUser('hráč')!;

	const newMoney = await changeUserMoney(user, -money);
	if (isUndefined(newMoney)) {
		return interaction.reply('Odebrání peněz se nepovedlo.');
	}

	return interaction.reply(`Hráči ${user} bylo odebráno ${money} peněz. Nyní má ${newMoney} peněz.`);
}
