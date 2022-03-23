import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';

import { createEmbed } from '../utils/create-embed';

export const data = new SlashCommandBuilder()
	.setName('prikazy')
	.setDescription('Vypíše seznam příkazů.');

export async function execute(interaction: CommandInteraction) {
	// Gets author of the message
	const { user } = interaction;

	// Builds the help
	const userCommands = createEmbed({ user, title: 'Uživatelské příkazy' })
		.addFields(
			{ name: '/prikazy', value: 'Vypíše seznam příkazů.' },
			{ name: '/penize', value: 'Vypíše aktuální stav konta hráče.' },
			{ name: '/platba @hráč částka', value: 'Pošle hráči peníze z vlastního konta.' },
		);
	const adminCommands = createEmbed({ user, title: 'Administrátorské příkazy' })
		.addFields(
			{ name: '/kontrola @hráč', value: 'Vypíše peníze konkrétního hráče.' },
			{ name: '/pripsatstart částka', value: 'Nastaví hodnotu startovních, kterou bude mít hráč na začátku.' },
			{ name: '/pripsat @hráč částka', value: 'Připíše hráči peníze.' },
			{ name: '/odebrat @hráč částka', value: 'Odebere hráči peníze.' },
			{ name: '/reset @hráč', value: 'Resetuje peníze hráče na startovní hodnotu peněz.' },
		);

	// Sends a message to the channel
	return interaction.reply({ embeds: [userCommands, adminCommands] });
}
