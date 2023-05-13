import {Client, Embed, User} from 'discord.js';
import {saveUserQuestCooldown} from '../../../models/user-reminder/user-reminder.service';
import ms from 'ms';

interface IRpgEpicQuest {
  client: Client;
  channelId: string;
  author: User;
}

const QUEST_COOLDOWN = ms('6h');

export default async function rpgEpicQuest({author}: IRpgEpicQuest) {
  await saveUserQuestCooldown({
    epicQuest: true,
    userId: author.id,
    readyAt: new Date(Date.now() + QUEST_COOLDOWN),
  });
}

interface IIsEpicQuestSuccess {
  embed: Embed;
  author: User;
}

export const isEpicQuestSuccess = ({embed, author}: IIsEpicQuestSuccess) =>
  embed.author?.name === `${author.username}— epic quest`;
