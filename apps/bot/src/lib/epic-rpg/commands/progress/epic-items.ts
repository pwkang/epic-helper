import {
  BOT_REMINDER_BASE_COOLDOWN,
  RPG_COMMAND_TYPE,
  RPG_COOLDOWN_EMBED_TYPE,
  RPG_EPIC_ITEM_TYPES,
} from '@epic-helper/constants';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {Client, Message, User} from 'discord.js';
import {IMessageContentChecker} from '../../../../types/utils';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';

const EPIC_ITEM_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.epicItem;

interface IRpgUseEpicItem {
  author: User;
  message: Message;
  client: Client;
  isSlashCommand: boolean;
}

export function rpgUseEpicItem({author, message, isSlashCommand, client}: IRpgUseEpicItem) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author: message.author,
    commandType: RPG_COOLDOWN_EMBED_TYPE.epicItem,
  });
  if (!event) return;
  event.on('content', async (content, collected) => {
    let type;
    if (isPlantingEpicSeed({author, message: collected})) {
      type = RPG_EPIC_ITEM_TYPES.epicSeed;
    } else if (isSummoningCoinRain({author, message: collected})) {
      type = RPG_EPIC_ITEM_TYPES.coinTrumpet;
    } else if (isPlacingUltraBait({author, message: collected})) {
      type = RPG_EPIC_ITEM_TYPES.ultraBait;
    }
    if (type) {
      event?.stop();
      await rpgUseEpicItemSuccess({
        author,
        client,
        channelId: message.channel.id,
        type,
      });
    }
  });
  event.on('cooldown', async (cooldown) => {
    await userReminderServices.updateUserCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      type: RPG_COMMAND_TYPE.epicItem,
    });
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgUseEpicItemSuccess {
  client: Client;
  channelId: string;
  author: User;
  type: ValuesOf<typeof RPG_EPIC_ITEM_TYPES>;
}

const rpgUseEpicItemSuccess = async ({author, type, channelId}: IRpgUseEpicItemSuccess) => {
  const toggleChecker = await toggleUserChecker({userId: author.id});
  if (!toggleChecker) return;

  if (toggleChecker.reminder.epicItem) {
    const cooldown = await calcCdReduction({
      userId: author.id,
      commandType: RPG_COMMAND_TYPE.daily,
      cooldown: EPIC_ITEM_COOLDOWN,
    });
    await userReminderServices.saveUserEpicItemCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      epicItemType: type,
    });
  }

  await updateReminderChannel({
    userId: author.id,
    channelId,
  });
};

const isPlantingEpicSeed = ({message}: IMessageContentChecker) =>
  ['planting the', 'epic seed'].every((word) => message.content.toLowerCase().includes(word));

const isSummoningCoinRain = ({message}: IMessageContentChecker) =>
  ['summoning the', 'coin rain'].every((word) => message.content.toLowerCase().includes(word));

const isPlacingUltraBait = ({message}: IMessageContentChecker) =>
  ['placing the', 'ultra bait'].every((word) => message.content.toLowerCase().includes(word));
