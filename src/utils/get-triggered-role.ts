import { Collection, GuildEmoji, ReactionEmoji, Role } from 'discord.js';
import { parseEmoji } from './parse-emoji';

export const getTriggeredRole = (
	messageContent: string,
	emoji: GuildEmoji | ReactionEmoji,
	roles: Collection<string, Role>,
): Role | undefined => {
	// Splits message into array by end of line
	const rows = messageContent.split('\n');

	let triggeredRole: Role | undefined = undefined;

	// Loops through rows
	rows.forEach(row => {
		// Splits row into array by space
		const [rawEmoji, rawRoleId] = row.split(' ');

		// Gets role id from raw role id
		const roleId = rawRoleId.replace(/\D/g, '');

		// Gets emoji from raw emoji
		const parsedEmoji = parseEmoji(rawEmoji);

		// Returns role if emote in row is equal to the emoji from reaction and role exists
		if (
			(parsedEmoji?.id === emoji.id || parsedEmoji?.name === emoji.name)
			&& roles.map(x => x.id).includes(roleId)
		) {
			triggeredRole = roles.find(x => x.id === roleId);
		}
	});

	return triggeredRole;
};
