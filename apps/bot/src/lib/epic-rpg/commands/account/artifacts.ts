import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import type {Client, Embed, Message, User} from 'discord.js';
import embedReaders from '../../embed-readers';
import {userService} from '../../../../services/database/user.service';
import messageChecker from '../../message-checker';

interface IRpgArtifacts {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export const rpgArtifacts = ({
  client,
  message,
  author,
  isSlashCommand,
}: IRpgArtifacts) => {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    client,
    channelId: message.channel.id,
    author,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (messageChecker.artifacts.isArtifactsEmbed(embed, author)) {
      await rpgArtifactsSuccess({
        embed,
        author,
      });
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgArtifactsSuccess {
  embed: Embed;
  author: User;
}

const rpgArtifactsSuccess = async ({
  embed,
  author,
}: IRpgArtifactsSuccess) => {
  const artifacts = embedReaders.artifacts(embed);
  const userAccount = await userService.getUserAccount(author.id);

  if (userAccount?.rpgInfo.artifacts.pocketWatch.owned !== artifacts.pocketWatch ||
    userAccount?.rpgInfo.artifacts.pocketWatch.percent !== artifacts.pocketWatchPercent) {
    await userService.updateUserPocketWatch({
      userId: author.id,
      owned: artifacts.pocketWatch,
      percent: artifacts.pocketWatchPercent,
    });
  }
};
