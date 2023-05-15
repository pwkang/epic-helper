import {Client, Embed, User} from 'discord.js';
import {saveUserQuestCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

interface IRpgEpicQuest {
  client: Client;
  channelId: string;
  author: User;
}

const QUEST_COOLDOWN = COMMAND_BASE_COOLDOWN.epicQuest;

export default async function rpgEpicQuest({author}: IRpgEpicQuest) {
  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.quest,
    cooldown: QUEST_COOLDOWN,
  });
  await saveUserQuestCooldown({
    epicQuest: true,
    userId: author.id,
    readyAt: new Date(Date.now() + cooldown),
  });
}

interface IIsEpicQuestSuccess {
  embed: Embed;
  author: User;
}

export const isEpicQuestSuccess = ({embed, author}: IIsEpicQuestSuccess) =>
  embed.author?.name === `${author.username} — epic quest` &&
  ['You failed the quest', 'Your profit was'].some((str) => embed.fields[0]?.value.includes(str));

interface IIsEpicHorseMissing {
  content: string;
}

export const isEpicHorseMissing = ({content}: IIsEpicHorseMissing) =>
  content.includes('special horse');

interface IIsHavingQuest {
  content: string;
}

export const isHavingQuest = ({content}: IIsHavingQuest) =>
  content.includes('You cannot do this if you have a pending quest!');
