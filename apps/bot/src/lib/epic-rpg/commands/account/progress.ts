import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {Channel, Client, Embed, Guild, Message, User} from 'discord.js';
import {IMessageEmbedChecker} from '../../../../types/utils';
import embedReaders from '../../embed-readers';
import commandHelper from '../../../epic-helper/command-helper';

interface IRpgProfile {
  server: Guild;
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgProgress = ({client, message, author, isSlashCommand, server}: IRpgProfile) => {
  if (!message.inGuild()) return;
  const event = createRpgCommandListener({
    client,
    channelId: message.channel.id,
    author,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isUserProfile({embed, author})) {
      await rpgProgressSuccess({
        client,
        embed,
        server,
        channel: message.channel,
        author,
      });
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgProfileSuccess {
  client: Client;
  server: Guild;
  embed: Embed;
  channel: Channel;
  author: User;
}

const rpgProgressSuccess = async ({embed, server, client, channel, author}: IRpgProfileSuccess) => {
  const progress = embedReaders.progress({
    embed,
  });
  await commandHelper.server.verifyTT({
    client,
    author,
    server,
    channelId: channel.id,
    timeTravels: progress.timeTravels,
  });
};

const isUserProfile = ({author, embed}: IMessageEmbedChecker) =>
  embed.author?.name === `${author.username} — progress`;
