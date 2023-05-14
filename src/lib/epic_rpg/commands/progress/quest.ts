import {Client, Message, User} from 'discord.js';
import {saveUserQuestCooldown} from '../../../../models/user-reminder/user-reminder.service';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';

interface IRpgQuest {
  client: Client;
  channelId: string;
  author: User;
  questAccepted?: boolean;
}

const QUEST_COOLDOWN = COMMAND_BASE_COOLDOWN.quest.accepted;
const DECLINED_QUEST_COOLDOWN = COMMAND_BASE_COOLDOWN.quest.declined;

export default async function rpgQuest({author, questAccepted}: IRpgQuest) {
  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.quest,
    cooldown: questAccepted ? QUEST_COOLDOWN : DECLINED_QUEST_COOLDOWN,
  });
  await saveUserQuestCooldown({
    epicQuest: false,
    userId: author.id,
    readyAt: new Date(Date.now() + cooldown),
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
