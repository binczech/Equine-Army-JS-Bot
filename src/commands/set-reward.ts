import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { setReward } from '../firebase';
import { hasUserAdminPermission } from '../utils/has-user-permission';
import { parseEmoji } from '../utils/parse-emoji';

export const data = new SlashCommandBuilder()
	.setName('nastavitodmenu')
	.setDescription('Nastaví odměnu za danou reakci od admina.')
	.addStringOption((option) =>
		option
			.setName('emoji')
			.setDescription('Emoji, za které má být odměna')
			.setRequired(true),
	)
	.addNumberOption((option) =>
		option
			.setName('částka')
			.setDescription('Částka, která se hráčovi připíše')
			.setRequired(true)
			.setMinValue(0),
	);

export async function execute(interaction: CommandInteraction) {
	// Checks if user has permission for this command
	if (!hasUserAdminPermission(interaction)) return interaction.reply('Nemáš oprávnění na tento příkaz.');

	// Gets arguments from the command
	const emoji = interaction.options.getString('emoji')!;
	const amount = interaction.options.getNumber('částka')!;

	// Checks if the emoji is valid
	const parsedEmoji = parseEmoji(emoji);
	console.log(parsedEmoji);

	if (!parsedEmoji) {
		return interaction.reply('Neplatné emoji.');
	}

	// Sets reward for the emoji
	const reward = await (setReward({ emojiId: Number(parsedEmoji.id), money: amount }));

	// Checks if the reward was set
	if (!reward || reward.money !== amount) {
		console.log(reward);
		return interaction.reply('Nastavení odměny se nepovedlo.');
	}

	// Sends a message to the channel
	return interaction.reply(`Odměna pro ${emoji} byla nastavena na ${amount}.`);
}
