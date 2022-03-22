import { CommandInteraction, PermissionResolvable } from 'discord.js';

export const hasUserPermission = (interaction: CommandInteraction) => (permission: PermissionResolvable): boolean =>
	interaction.memberPermissions?.has(permission) ?? false;

export const hasUserAdminPermission = (interaction: CommandInteraction): boolean =>
	hasUserPermission(interaction)('ADMINISTRATOR');
