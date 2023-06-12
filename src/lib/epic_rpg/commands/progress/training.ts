import type {Client, Embed, Message, User} from 'discord.js';
import {
  saveUserTrainingCooldown,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/epic_helper/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {RPG_COMMAND_TYPE} from '../../../../constants/epic_rpg/rpg';
import {createRpgCommandListener} from '../../createRpgCommandListener';
import getTrainingAnswer from '../../../../utils/epic_rpg/trainingAnswer';
import sendMessage from '../../../discord.js/message/sendMessage';
import {updateReminderChannel} from '../../../../utils/reminderChannel';
import {countUserStats} from '../../../../models/user-stats/user-stats.service';
import {USER_STATS_RPG_COMMAND_TYPE} from '../../../../models/user-stats/user-stats.types';

interface IRpgTraining {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgTraining({client, message, author, isSlashCommand}: IRpgTraining) {
  const event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
  });
  if (!event) return;
  event.on('content', async (content) => {
    if (isRpgTrainingQuestion({author, content})) {
      event.pendingAnswer();
      const answer = await getTrainingAnswer({author, content});
      sendMessage({
        channelId: message.channel.id,
        client,
        options: {
          components: answer,
        },
      });
    }

    if (isRpgTrainingSuccess({author, content})) {
      rpgTrainingSuccess({
        author,
        channelId: message.channel.id,
        client,
      });
    }
  });
  event.on('cooldown', (cooldown) => {
    updateUserCooldown({
      userId: author.id,
      type: RPG_COMMAND_TYPE.training,
      readyAt: new Date(Date.now() + cooldown),
    });
  });
  event.on('embed', (embed) => {
    if (isEncounteringPet({author, embed})) {
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgTrainingSuccess {
  client: Client;
  channelId: string;
  author: User;
}

const TRAINING_COOLDOWN = COMMAND_BASE_COOLDOWN.training;

export default async function rpgTrainingSuccess({author, channelId}: IRpgTrainingSuccess) {
  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.training,
    cooldown: TRAINING_COOLDOWN,
  });
  await saveUserTrainingCooldown({
    userId: author.id,
    ultraining: false,
    readyAt: new Date(Date.now() + cooldown),
  });
  updateReminderChannel({
    userId: author.id,
    channelId,
  });

  countUserStats({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.training,
  });
}

interface IIsRpgTrainingSuccess {
  content: Message['content'];
  author: User;
}

export function isRpgTrainingSuccess({author, content}: IIsRpgTrainingSuccess) {
  return (
    content.includes(author.username) &&
    ['Well done', 'Better luck next time'].some((msg) => content.includes(msg))
  );
}

interface IIsRpgTrainingQuestion {
  content: Message['content'];
  author: User;
}

export function isRpgTrainingQuestion({author, content}: IIsRpgTrainingQuestion) {
  return content.includes(author.username) && content.includes('is training in');
}

interface IIsEncounteringPet {
  embed: Embed;
  author: User;
}

export const isEncounteringPet = ({embed, author}: IIsEncounteringPet) =>
  [author.username, 'IS APPROACHING'].every((msg) => embed.fields[0]?.name?.includes(msg));
