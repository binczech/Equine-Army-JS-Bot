import { ColorResolvable, MessageEmbed, User } from 'discord.js';

import { DEFAULT_COLOR } from '../app/consts';

interface CreateEmbedParams {
    color?: ColorResolvable,
    title?: string,
    user?: User,
}

export const createEmbed = ({ color, title, user }: CreateEmbedParams): MessageEmbed =>
	new MessageEmbed()
		.setColor(color ?? DEFAULT_COLOR)
		.setTitle(title ?? 'Odpověď bota')
		.setTimestamp()
		.setFooter(user ? { text: user.username, iconURL: user.avatarURL() ?? undefined } : null)
    ;
