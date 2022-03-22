import { SlashCommandBuilder } from '@discordjs/builders';
import { Client, CommandInteraction } from 'discord.js';
import config from '../config';
import { changeUserMoney } from '../firebase';

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
			.setMinValue(0),
	);

export async function execute(interaction: CommandInteraction, client: Client) {
	const amount = interaction.options.getInteger('částka')!;
	const role = interaction.options.getRole('role')!;
	const members = client.guilds.cache.get(config.GUILD_ID)?.members.fetch();
	const membersWithRole = (await members)?.filter(member => member.roles.cache.has(role.id));
	membersWithRole?.forEach(member => changeUserMoney(member.user, amount));

	return interaction.reply(`Uživatelům s rolí ${role} bylo připsáno ${amount} peněz.`);
}
