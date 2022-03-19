import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

export const data = new SlashCommandBuilder()
	.setName('pripsatroli')
	.setDescription('Připíše peníze hráčům s rolí.')
	.addRoleOption((option) =>
		option
			.setName('role')
			.setDescription('Role, u které se všem hráčům připíšou peníze')
			.setRequired(true),
	)
	.addIntegerOption((option) =>
		option
			.setName('částka')
			.setDescription('Částka, která se hráčům připíše')
			.setRequired(true)
			.setMinValue(0)
			.setMaxValue(5000),
	);

export async function execute(interaction: CommandInteraction) {
	const amount = interaction.options.getInteger('částka')!;
	const role = interaction.options.getRole('role')!;
	return interaction.reply(`Uživatelům s rolí ${role} bylo připsáno ${amount} peněz.`);
}
