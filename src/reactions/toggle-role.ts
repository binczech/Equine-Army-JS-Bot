import { MessageReaction, PartialMessageReaction, PartialUser, User } from 'discord.js';
import { isUndefined } from 'lodash/fp';
import config from '../config';
import { getTriggeredRole } from '../utils/get-triggered-role';

export async function toggleRole(
	reaction: MessageReaction | PartialMessageReaction,
	user: User | PartialUser,
	addRoleToUser: boolean = true,
) {
	const { message: { channelId }, emoji } = reaction;
	// Checks if the reaction is from the correct channel
	if (channelId !== config.ROLES_CHANNEL) return;

	// Loads message content
	const messageContent = (await reaction.message.fetch()).content;
	// Loads and checks server roles
	const roles = (await reaction.message.guild?.roles.fetch());
	if (isUndefined(roles)) {
		console.error('Error getting server roles');
		return;
	}

	const role = getTriggeredRole(messageContent, emoji, roles);

	// Checks if some role was triggered
	if (isUndefined(role)) return;

	// Adds role to the user
	reaction.message.guild?.members.fetch(user.id).then(
		fetchedUser => addRoleToUser
			? fetchedUser.roles.add(role)
			: fetchedUser.roles.remove(role),
	);
}
