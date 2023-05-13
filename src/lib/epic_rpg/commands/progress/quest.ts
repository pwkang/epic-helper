import {Client, Message, User} from 'discord.js';
import {saveUserQuestCooldown} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';

interface IRpgQuest {
  client: Client;
  channelId: string;
  author: User;
  questAccepted?: boolean;
}

const QUEST_COOLDOWN = ms('6h');
const DECLINED_QUEST_COOLDOWN = ms('1h');

export default async function rpgQuest({author, questAccepted}: IRpgQuest) {
  await saveUserQuestCooldown({
    epicQuest: false,
    userId: author.id,
    readyAt: new Date(Date.now() + (questAccepted ? QUEST_COOLDOWN : DECLINED_QUEST_COOLDOWN)),
  });
}

interface IIsQuestAccepted {
  content: string;
  author: User;
}

export const isQuestAccepted = ({content, author}: IIsQuestAccepted) =>
  content.includes(author.username) && content.includes('new quest');

interface IIsQuestDeclined {
  message: Message;
  author: User;
}

export const isQuestDeclined = ({message, author}: IIsQuestDeclined) =>
  message.mentions.has(author.id) && message.content.includes('you did not accept the quest');
