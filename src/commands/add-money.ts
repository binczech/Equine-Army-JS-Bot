import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('pripsat')
	.setDescription('Připíše hráči peníze.')
	.addUserOption((option) =>
		option
			.setName('hráč')
			.setDescription('Hráč, kterému se připíšou peníze')
			.setRequired(true),
	)
	.addIntegerOption((option) =>
		option
			.setName('částka')
			.setDescription('Částka, která se hráčovi připíše')
			.setRequired(true)
			.setMinValue(0)
			.setMaxValue(5000),
	);

export async function execute(interaction: CommandInteraction) {
	const amount = interaction.options.getInteger('částka')!;
	const user = interaction.options.getUser('hráč')!;
	return interaction.reply(`Hráči ${user} bylo připsáno ${amount} peněz.`);
}
