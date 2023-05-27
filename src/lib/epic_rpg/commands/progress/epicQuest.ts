import {Client, Embed, Message, User} from 'discord.js';
import {
  saveUserQuestCooldown,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';
import {createRpgCommandListener} from '../../createRpgCommandListener';

interface IRpgEpicQuest {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgEpicQuest({client, message, author, isSlashCommand}: IRpgEpicQuest) {
  const event = createRpgCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('embed', async (embed) => {
    if (isEpicQuestSuccess({embed, author})) {
      await rpgEpicQuestSuccess({
        author,
        channelId: message.channel.id,
        client,
      });
    }
  });
  event.on('content', async (content) => {
    if (isEpicHorseMissing({content})) {
      event.stop();
    }
    if (isHavingQuest({content})) {
      event.stop();
    }
  });
  event.on('cooldown', async (cooldown) => {
    await updateUserCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      type: RPG_COMMAND_TYPE.quest,
    });
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgEpicQuestSuccess {
  client: Client;
  channelId: string;
  author: User;
}

const QUEST_COOLDOWN = COMMAND_BASE_COOLDOWN.epicQuest;

export default async function rpgEpicQuestSuccess({author}: IRpgEpicQuestSuccess) {
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
