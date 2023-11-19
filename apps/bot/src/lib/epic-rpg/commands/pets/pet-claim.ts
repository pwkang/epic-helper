import type {IMessageContentChecker, IMessageEmbedChecker} from '../../../../types/utils';
import type {Client, Embed, Message, User} from 'discord.js';
import {userPetServices} from '../../../../services/database/user-pet.service';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';

interface IRpgPetClaim {
  client: Client;
  author: User;
  message: Message;
  isSlashCommand: boolean;
}

export const rpgPetClaim = async ({
  author,
  message,
  client,
  isSlashCommand,
}: IRpgPetClaim) => {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author: message.author,
  });
  if (!event) return;
  event.on('content', (_, collected) => {
    if (isNoPetsToClaim({message: collected, author})) {
      event?.stop();
    }
  });
  event.on('embed', async (embed) => {
    if (isSuccessfullyClaimedPet({embed, author})) {
      event?.stop();
      await rpgPetClaimSuccess({
        client,
        embed,
        author,
        message,
      });
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgPetClaimSuccess {
  embed: Embed;
  author: User;
  client: Client;
  message: Message<true>;
}

const rpgPetClaimSuccess = async ({author, client, message}: IRpgPetClaimSuccess) => {
  const toggleUser = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
  if (!toggleUser?.reminder.pet) return;

  await userPetServices.claimAllPets({
    userId: author.id,
  });
};

const isSuccessfullyClaimedPet = ({embed, author}: IMessageEmbedChecker) =>
  ['Reward summary', 'Pet adventure rewards'].some((str) =>
    embed.title?.includes(str),
  ) && embed.author?.name === `${author.username} — pets`;

const isNoPetsToClaim = ({message, author}: IMessageContentChecker) =>
  message.content.includes('there are no pet adventure rewards to claim') &&
  message.mentions.has(author.id);
