import type {Embed, User} from 'discord.js';

const isArtifactsEmbed = (embed: Embed, author: User) =>
  embed.author?.name === `${author.username} — artifacts`;

export const _artifactMessageChecker = {
  isArtifactsEmbed,
};
