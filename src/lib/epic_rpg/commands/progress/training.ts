import type {Client, Embed, Message, User} from 'discord.js';
import {saveUserTrainingCooldown} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

interface IRpgTraining {
  client: Client;
  channelId: string;
  author: User;
  ultraining: boolean;
}

const TRAINING_COOLDOWN = COMMAND_BASE_COOLDOWN.training;

export default async function rpgTraining({author, ultraining}: IRpgTraining) {
  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.training,
    cooldown: TRAINING_COOLDOWN,
  });
  await saveUserTrainingCooldown({
    userId: author.id,
    ultraining,
    readyAt: new Date(Date.now() + cooldown),
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

interface IIsRpgUltrainingSuccess {
  embed: Embed;
  author: User;
}

export function isRpgUltrainingSuccess({author, embed}: IIsRpgUltrainingSuccess) {
  return [author.username, 'Well done'].every((msg) => embed.description?.includes(msg));
}
