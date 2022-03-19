import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('penize')
	.setDescription('Vypíše aktuální stav konta hráče.');

export async function execute(interaction: CommandInteraction) {
	return interaction.reply(`Hráč ${interaction.user} má 1234 peněz.`);
}
