import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { isUndefined } from 'lodash';
import { changeUserMoney, getUser } from '../firebase';

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
			.setMinValue(0),
	);

export async function execute(interaction: CommandInteraction) {
	// Gets arguments from the command
	const amount = interaction.options.getInteger('částka')!;
	const user = interaction.options.getUser('hráč')!;
	// Gets the author of the message
	const author = interaction.user;

	// Checks if the user is not sending money to themselves
	if (author.id === user.id) {
		return interaction.reply('Nemůžeš poslat peníze sám sobě');
	}

	// Gets the user and the author from the database
	const authorData = await getUser(author);
	const userData = await getUser(user);
	// Checks if data was found
	if (isUndefined(authorData) || isUndefined(userData)) {
		return interaction.reply('Poslání peněz se nepovedlo.');
	}

	// Checks if the user has enough money
	if (authorData.money < amount) {
		return interaction.reply('Nemáš dost peněz.');
	}

	// Changes the money of the user and the author
	const newAuthorMoney = await changeUserMoney(author, -amount);
	const newUserMoney = await changeUserMoney(user, amount);

	// Checks if the money was changed
	if (isUndefined(newAuthorMoney) || isUndefined(newUserMoney)) {
		return interaction.reply('Poslání peněz se nepovedlo.');
	}

	// Sends a message to the channel
	return interaction.reply(`Úspěšně provedena platba (${amount}) hráčem ${interaction.user} hráči ${user}. \
Hráč ${author} má nyní ${newAuthorMoney} peněz a hráč ${user} má nyní ${newUserMoney}.`);
}
