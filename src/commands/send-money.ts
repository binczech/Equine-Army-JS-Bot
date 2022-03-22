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
	const amount = interaction.options.getInteger('částka')!;
	const user = interaction.options.getUser('hráč')!;
	const author = interaction.user;

	if (author.id === user.id) {
		return interaction.reply('Nemůžeš poslat peníze sám sobě');
	}

	const authorData = await getUser(author);
	const userData = await getUser(user);

	if (isUndefined(authorData) || isUndefined(userData)) {
		return interaction.reply('Poslání peněz se nepovedlo.');
	}

	if (authorData.money < amount) {
		return interaction.reply('Nemáš dost peněz.');
	}

	const newAuthorMoney = await changeUserMoney(author, -amount);
	const newUserMoney = await changeUserMoney(user, amount);

	if (isUndefined(newAuthorMoney) || isUndefined(newUserMoney)) {
		return interaction.reply('Poslání peněz se nepovedlo.');
	}

	return interaction.reply(`Úspěšně provedena platba (${amount}) hráčem ${interaction.user} hráči ${user}. \
Hráč ${author} má nyní ${newAuthorMoney} peněz a hráč ${user} má nyní ${newUserMoney}.`);
}
