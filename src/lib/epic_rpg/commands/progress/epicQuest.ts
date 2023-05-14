import {Client, Embed, User} from 'discord.js';
import {saveUserQuestCooldown} from '../../../../models/user-reminder/user-reminder.service';
import ms from 'ms';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';

interface IRpgEpicQuest {
  client: Client;
  channelId: string;
  author: User;
}

const QUEST_COOLDOWN = COMMAND_BASE_COOLDOWN.epicQuest;

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
