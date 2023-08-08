import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {Channel, Client, Embed, Guild, Message, User} from 'discord.js';
import {IMessageEmbedChecker} from '../../../../types/utils';
import embedReaders from '../../embed-readers';
import commandHelper from '../../../epic-helper/command-helper';
import {serverService} from '../../../../services/database/server.service';
import {djsMessageHelper} from '../../../discordjs/message';
import embedProvider from '../../../epic-helper/embeds';
import toggleServerChecker from '../../../epic-helper/toggle-checker/server';

interface IRpgProfile {
  server: Guild;
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgProfile = ({client, message, author, isSlashCommand, server}: IRpgProfile) => {
  if (!message.inGuild()) return;
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
  event.on('attachments', async () => {
    await rpgProfileAttachment({
      channelId: message.channel.id,
      server,
      client,
      author,
    });
    event.stop();
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

interface IRpgProfileAttachment {
  server: Guild;
  channelId: string;
  client: Client;
  author: User;
}

const rpgProfileAttachment = async ({server, channelId, client, author}: IRpgProfileAttachment) => {
  const serverAccount = await serverService.getServer({
    serverId: server.id,
  });
  if (!serverAccount) return;
  const toggleServer = await toggleServerChecker({
    serverId: server.id,
  });
  if (!toggleServer?.ttVerification) return;
  const ttVerificationSettings = serverAccount.settings.ttVerification;
  if (!ttVerificationSettings) return;
  if (ttVerificationSettings.channelId !== channelId) return;

  await djsMessageHelper.send({
    client,
    channelId,
    options: {
      embeds: [
        embedProvider.profileBackgroundNotSupported({
          author,
        }),
      ],
    },
  });
};
