import type {Client, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../../utils/rpg-command-listener';
import {BOT_REMINDER_BASE_COOLDOWN, RPG_COMMAND_TYPE, RPG_COOLDOWN_EMBED_TYPE} from '@epic-helper/constants';
import messageChecker from '../../../message-checker';
import toggleUserChecker from '../../../../epic-helper/toggle-checker/user';
import {calcCdReduction} from '../../../../epic-helper/reminders/commands-cooldown';
import {userReminderServices} from '@epic-helper/services';

interface IRpgXmasChimney {
  client: Client;
  message: Message<true>;
  author: User;
  isSlashCommand?: boolean;
}

export const rpgXmasChimney = async ({message, client, isSlashCommand, author}: IRpgXmasChimney) => {
  let event = createRpgCommandListener({
    client,
    author,
    commandType: RPG_COOLDOWN_EMBED_TYPE.xmasChimney,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('content', async (content, message) => {
    if (messageChecker.event.xmas.isChimneySuccess(content, author)) {
      event?.stop();
      await rpgXmasChimneySuccess({client, author, message});
    }
  });
  event.on('cooldown', async (cooldown) => {
    await userReminderServices.saveUserXmasChimneyCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
    });
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgXmasChimneySuccess {
  client: Client;
  author: User;
  message: Message<true>;
}

const rpgXmasChimneySuccess = async ({client, author, message}: IRpgXmasChimneySuccess) => {
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
  if (!toggleChecker) return;

  if (toggleChecker.reminder.xmasChimney) {
    const cooldown = await calcCdReduction({
      userId: author.id,
      commandType: RPG_COMMAND_TYPE.xmasChimney,
      cooldown: BOT_REMINDER_BASE_COOLDOWN.xmasChimney,
    });
    await userReminderServices.saveUserXmasChimneyCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
    });
  }


};
