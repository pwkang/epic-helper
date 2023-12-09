import type {Client, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {RPG_COMMAND_TYPE} from '@epic-helper/constants';
import messageChecker from '../../message-checker';
import {userReminderServices} from '@epic-helper/services';

interface IRpgUseSleepyPotion {
  client: Client;
  message: Message<true>;
  author: User;
  isSlashCommand?: boolean;
}

export const rpgUseSleepyPotion = async ({message, client, isSlashCommand, author}: IRpgUseSleepyPotion) => {
  let event = createRpgCommandListener({
    client,
    author,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('content', async (content) => {
    if (messageChecker.event.sleepyPotion.isSuccess(content, author)) {
      event?.stop();
      await rpgUseSleepyPotionSuccess({author});
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
};

interface IRpgUseSleepyPotionSuccess {
  author: User;
}

const rpgUseSleepyPotionSuccess = async ({author}: IRpgUseSleepyPotionSuccess) => {
  await userReminderServices.deleteUserCooldowns({
    userId: author.id,
    types: [
      RPG_COMMAND_TYPE.daily,
      RPG_COMMAND_TYPE.weekly,
      RPG_COMMAND_TYPE.lootbox,
      RPG_COMMAND_TYPE.hunt,
      RPG_COMMAND_TYPE.adventure,
      RPG_COMMAND_TYPE.training,
      RPG_COMMAND_TYPE.duel,
      RPG_COMMAND_TYPE.quest,
      RPG_COMMAND_TYPE.working,
      RPG_COMMAND_TYPE.farm,
      RPG_COMMAND_TYPE.horse,
      RPG_COMMAND_TYPE.arena,
      RPG_COMMAND_TYPE.dungeon,
    ],
  });

};
