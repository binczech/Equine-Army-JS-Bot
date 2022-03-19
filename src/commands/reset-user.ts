import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

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
	const user = interaction.options.getUser('hráč')!;

	return interaction.reply(`Hráči ${user} byly resetovány peníze na částku 1234.`);
}
