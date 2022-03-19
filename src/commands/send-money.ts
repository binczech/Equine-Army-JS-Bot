import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('platba')
	.setDescription('Pošle hráči peníze z vlastního konta.')
	.addUserOption((option) =>
		option
			.setName('hráč')
			.setDescription('Hráč, kterému se pošlou peníze')
			.setRequired(true),
	)
	.addIntegerOption((option) =>
		option
			.setName('částka')
			.setDescription('Částka, která se hráčovi pošle')
			.setRequired(true)
			.setMinValue(0)
			.setMaxValue(5000),
	);

export async function execute(interaction: CommandInteraction) {
	const amount = interaction.options.getInteger('částka')!;
	const user = interaction.options.getUser('hráč')!;
	return interaction.reply(`Úspěšně provedena platba (${amount}) hráčem ${interaction.user} hráči ${user}.`);
}
