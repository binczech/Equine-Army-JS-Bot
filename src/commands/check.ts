import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

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
	const user = interaction.options.getUser('hráč')!;
	return interaction.reply(`Hráč ${user} má 1324 peněz.`);
}
