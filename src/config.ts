import dotenv from 'dotenv';

dotenv.config();
const { CLIENT_ID, GUILD_ID, DISCORD_TOKEN, ROLES_CHANNEL } = process.env;

if (!CLIENT_ID || !GUILD_ID || !DISCORD_TOKEN) {
	throw new Error('Missing environment variables');
}

const config = {
	CLIENT_ID,
	GUILD_ID,
	DISCORD_TOKEN,
	ROLES_CHANNEL,
};

export default config;
