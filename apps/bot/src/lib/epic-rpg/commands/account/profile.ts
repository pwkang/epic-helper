import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {Channel, Client, Embed, Guild, Message, User} from 'discord.js';
import {IMessageEmbedChecker} from '../../../../types/utils';
import embedReaders from '../../embed-readers';
import {serverService} from '../../../../services/database/server.service';
import {djsMemberHelper} from '../../../discordjs/member';
import messageFormatter from '../../../discordjs/message-formatter';
import commandHelper from '../../../epic-helper/command-helper';

interface IRpgProfile {
  server: Guild;
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgProfile = ({client, message, author, isSlashCommand, server}: IRpgProfile) => {
  const event = createRpgCommandListener({
    client,
    channelId: message.channel.id,
    author,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isUserProfile({embed, author})) {
      await rpgProfileSuccess({
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

const rpgProfileSuccess = async ({embed, server, client, channel, author}: IRpgProfileSuccess) => {
  const profile = embedReaders.profile({
    embed,
  });
  await commandHelper.server.verifyTT({
    client,
    author,
    server,
    channelId: channel.id,
    timeTravels: profile.timeTravels,
  });
};

const isUserProfile = ({author, embed}: IMessageEmbedChecker) =>
  embed.author?.name === `${author.username} — profile`;
