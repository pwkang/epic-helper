import type {Client, Embed, Message, User} from 'discord.js';
import {saveUserTrainingCooldown} from '../../../models/user-reminder/user-reminder.service';
import ms from 'ms';

interface IRpgTraining {
  client: Client;
  channelId: string;
  author: User;
  ultraining: boolean;
}

const TRAINING_COOLDOWN = ms('15m');

export default async function rpgTraining({author, client, channelId, ultraining}: IRpgTraining) {
  await saveUserTrainingCooldown({
    userId: author.id,
    ultraining,
    readyAt: new Date(Date.now() + TRAINING_COOLDOWN),
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
