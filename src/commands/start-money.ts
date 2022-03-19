import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('pripsatstart')
	.setDescription('Nastaví hodnotu startovních, kterou bude mít hráč na začátku.')
	.addIntegerOption((option) =>
		option
			.setName('částka')
			.setDescription('Startovní částka na začátku')
			.setRequired(true)
			.setMinValue(0)
			.setMaxValue(5000),
	);

export async function execute(interaction: CommandInteraction) {
	const amount = interaction.options.getInteger('částka')!;
	return interaction.reply(`Hodnota startovních peněz změněna na ${amount}.`);
}
