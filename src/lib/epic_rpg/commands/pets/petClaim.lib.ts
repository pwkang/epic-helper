import {IMessageContentChecker, IMessageEmbedChecker} from '../../../../types/utils';
import {Client, Embed, User} from 'discord.js';
import {claimAllPets} from '../../../../models/user-pet/user-pet.service';

interface IRpgPetClaim {
  embed: Embed;
  author: User;
  client: Client;
}

export const rpgPetClaim = async ({author}: IRpgPetClaim) => {
  await claimAllPets({
    userId: author.id,
  });
};

export const isSuccessfullyClaimedPet = ({embed, author}: IMessageEmbedChecker) =>
  ['Reward summary', 'Pet adventure rewards'].some((str) => embed.title?.includes(str)) &&
  embed.author?.name === `${author.username} — pets`;

export const isNoPetsToClaim = ({message, author}: IMessageContentChecker) =>
  message.content.includes('there are no pet adventure rewards to claim') &&
  message.mentions.has(author.id);
