import {Embed, User} from 'discord.js';

interface IRpgCooldown {
  embed: Embed;
  author: User;
}

export default function rpgCooldown({author, embed}: IRpgCooldown) {}

interface IIsRpgCooldownResponse {
  embed: Embed;
  author: User;
}

export const isRpgCooldownResponse = ({embed, author}: IIsRpgCooldownResponse) =>
  embed.author?.name === `${author.username} — cooldowns`;
