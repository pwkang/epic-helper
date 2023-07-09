import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {Client, Embed, Message, User} from 'discord.js';
import {IMessageEmbedChecker} from '../../../../types/utils';
import embedReaders from '../../embed-readers';
import {createJsonBin} from '@epic-helper/utils';

interface IRpgProfile {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgProfile = ({client, message, author, isSlashCommand}: IRpgProfile) => {
  const event = createRpgCommandListener({
    client,
    channelId: message.channel.id,
    author,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isUserProfile({embed, author})) {
      await rpgProfileSuccess({
        embed,
      });
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgProfileSuccess {
  embed: Embed;
}

const rpgProfileSuccess = async ({embed}: IRpgProfileSuccess) => {
  const profile = embedReaders.profile({
    embed,
  });
};

const isUserProfile = ({author, embed}: IMessageEmbedChecker) =>
  embed.author?.name === `${author.username} — profile`;
