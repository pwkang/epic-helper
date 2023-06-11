import {Client, Message, User} from 'discord.js';
import {
  saveUserFarmCooldown,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import {RPG_COMMAND_TYPE, RPG_FARM_SEED} from '../../../../constants/rpg';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {createRpgCommandListener} from '../../createRpgCommandListener';
import {updateReminderChannel} from '../../../../utils/reminderChannel';
import {countUserStats} from '../../../../models/user-stats/user-stats.service';
import {USER_STATS_RPG_COMMAND_TYPE} from '../../../../models/user-stats/user-stats.types';

const FARM_COOLDOWN = COMMAND_BASE_COOLDOWN.farm;

interface IRpgFarm {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgFarm({client, message, author, isSlashCommand}: IRpgFarm) {
  const event = createRpgCommandListener({
    author,
    client,
    channelId: message.channel.id,
  });
  if (!event) return;
  event.on('content', (content, collected) => {
    if (isRpgFarmSuccess({content, author})) {
      rpgFarmSuccess({
        author,
        client,
        channelId: message.channel.id,
        content,
      });
      event.stop();
    }
    if (isFarmingInSpace({content, author})) {
      event.stop();
    }
    if (hasNoSeedToPlant({message: collected, author})) {
      event.stop();
    }
  });
  event.on('cooldown', (cooldown) => {
    updateUserCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      type: RPG_COMMAND_TYPE.farm,
    });
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgFarmSuccess {
  client: Client;
  channelId: string;
  author: User;
  content: Message['content'];
}

export default async function rpgFarmSuccess({content, author, channelId}: IRpgFarmSuccess) {
  const seedType = whatIsTheSeed(content);
  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.farm,
    cooldown: FARM_COOLDOWN,
  });
  await saveUserFarmCooldown({
    userId: author.id,
    readyAt: new Date(Date.now() + cooldown),
    seedType,
  });
  updateReminderChannel({
    userId: author.id,
    channelId,
  });

  countUserStats({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.farm,
  });
}

interface IIsRpgFarmSuccess {
  content: string;
  author: User;
}

export const isRpgFarmSuccess = ({author, content}: IIsRpgFarmSuccess) =>
  content.includes(author.username) &&
  ['have grown from the seed', 'HITS THE FLOOR WITH THE FISTS', 'in the ground...'].some((msg) =>
    content.includes(msg)
  );

function whatIsTheSeed(content: string) {
  return Object.values(RPG_FARM_SEED).find((seed) => seed && content.split('\n')[0].includes(seed));
}

interface IIsFarmingInSpace {
  content: string;
  author: User;
}

export const isFarmingInSpace = ({content}: IIsFarmingInSpace) =>
  ['no land to plant'].some((msg) => content.includes(msg));

interface IHasNoSeedToPlant {
  message: Message;
  author: User;
}

export const hasNoSeedToPlant = ({message, author}: IHasNoSeedToPlant) =>
  message.mentions.has(author.id) &&
  (['you need a', 'seed'].every((msg) => message.content.includes(msg)) ||
    ['you do not have this type of seed'].some((msg) => message.content.includes(msg)));
