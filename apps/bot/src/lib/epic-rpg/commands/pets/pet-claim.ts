import {IMessageContentChecker, IMessageEmbedChecker} from '../../../../types/utils';
import {Client, Embed, User} from 'discord.js';
import {userPetServices} from '@epic-helper/models';

interface IRpgPetClaim {
  embed: Embed;
  author: User;
  client: Client;
}

export const rpgPetClaim = async ({author}: IRpgPetClaim) => {
  await userPetServices.claimAllPets({
    userId: author.id,
  });
};

const isSuccessfullyClaimedPet = ({embed, author}: IMessageEmbedChecker) =>
  ['Reward summary', 'Pet adventure rewards'].some((str) => embed.title?.includes(str)) &&
  embed.author?.name === `${author.username} — pets`;

export const isNoPetsToClaim = ({message, author}: IMessageContentChecker) =>
  message.content.includes('there are no pet adventure rewards to claim') &&
  message.mentions.has(author.id);

export const rpgPetClaimChecker = {
  isSuccessfullyClaimedPet,
};
