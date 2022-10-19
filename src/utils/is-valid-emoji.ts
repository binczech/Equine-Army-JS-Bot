import emojiRegex from 'emoji-regex';
import { EMOJI_REGEX } from '../app/consts';

export const isValidEmoji = (emoji: string): boolean => EMOJI_REGEX.test(emoji) || emojiRegex().test(emoji);
