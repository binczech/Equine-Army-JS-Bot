import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { isEmpty, isUndefined } from 'lodash/fp';
import { getRewards } from '../firebase';
import { createEmbed } from '../utils/create-embed';
import { hasUserAdminPermission } from '../utils/has-user-permission';

export const data = new SlashCommandBuilder()
	.setName('zobrazitodmeny')
	.setDescription('Zobrazí seznam odměn.');

export async function execute(interaction: CommandInteraction) {
	// Checks if user has permission for this command
	if (!hasUserAdminPermission(interaction)) return interaction.reply('Nemáš oprávnění na tento příkaz.');

	// Gets all rewards
	const rewards = await getRewards();

	// Checks if there are any rewards
	if (isUndefined(rewards) || isEmpty(rewards)) {
		return interaction.reply('Nejsou nastaveny žádné odměny.');
	}

	// Gets author of the message
	const { user } = interaction;

	// Builds a message with the rewards
	const rewardsEmbed = createEmbed({ user, title: 'Odměny' });

	// Adds each reward to the message
	rewards.forEach(x => rewardsEmbed.addField(String(x.emojiId), String(x.money), true));

	// Sends a message to the channel
	return interaction.reply({ embeds: [rewardsEmbed] });
}
