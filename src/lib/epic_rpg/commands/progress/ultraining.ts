import {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../createRpgCommandListener';
import {
  saveUserTrainingCooldown,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE} from '../../../../constants/epic_rpg/rpg';
import {BOT_REMINDER_BASE_COOLDOWN} from '../../../../constants/epic_helper/command_base_cd';
import {calcCdReduction} from '../../../epic_helper/reminders/commandsCooldown';
import {updateReminderChannel} from '../../../epic_helper/reminders/reminderChannel';
import {countUserStats} from '../../../../models/user-stats/user-stats.service';
import {USER_STATS_RPG_COMMAND_TYPE} from '../../../../models/user-stats/user-stats.types';

interface IRpgUltraining {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgUltraining({client, message, author, isSlashCommand}: IRpgUltraining) {
  const event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
  });
  if (!event) return;
  event.on('embed', (embed) => {
    if (isRpgUltrainingSuccess({embed, author})) {
      rpgUlTrainingSuccess({
        author,
        channelId: message.channel.id,
        client,
      });
      event.stop();
    }
  });
  event.on('cooldown', (cooldown) => {
    updateUserCooldown({
      userId: author.id,
      type: RPG_COMMAND_TYPE.training,
      readyAt: new Date(Date.now() + cooldown),
    });
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IIsRpgUltrainingSuccess {
  embed: Embed;
  author: User;
}

interface IRpgTrainingSuccess {
  client: Client;
  channelId: string;
  author: User;
}

const TRAINING_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.training;

export default async function rpgUlTrainingSuccess({author, channelId}: IRpgTrainingSuccess) {
  const cooldown = await calcCdReduction({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.training,
    cooldown: TRAINING_COOLDOWN,
  });
  await saveUserTrainingCooldown({
    userId: author.id,
    ultraining: true,
    readyAt: new Date(Date.now() + cooldown),
  });
  updateReminderChannel({
    userId: author.id,
    channelId,
  });

  countUserStats({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.ultraining,
  });
}

export function isRpgUltrainingSuccess({author, embed}: IIsRpgUltrainingSuccess) {
  return [author.username, 'Well done'].every((msg) => embed.description?.includes(msg));
}
