import emojiRegex from 'emoji-regex';
import { EMOJI_REGEX } from '../app/consts';
import { Emoji } from '../types/emoji';
import { isValidEmoji } from './is-valid-emoji';

export const parseEmoji = (emoji: string): Emoji | undefined => {
	if (!isValidEmoji(emoji)) {
		return undefined;
	}

	if (emojiRegex().test(emoji)) {
		return {
			animated: false,
			name: emoji,
			id: emoji,
		};
	}

	const match = emoji.match(EMOJI_REGEX);

	if (!match) {
		return undefined;
	}

	const { isAnimated, name, id } = match.groups || {};
	return {
		animated: isAnimated === 'a',
		name,
		id,
	};
};
