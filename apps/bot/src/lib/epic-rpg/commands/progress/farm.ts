import type {Client, Embed, Message, User} from 'discord.js';
import {
  BOT_REMINDER_BASE_COOLDOWN,
  RPG_COMMAND_TYPE,
  RPG_COOLDOWN_EMBED_TYPE,
  RPG_FARM_SEED,
} from '@epic-helper/constants';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';
import commandHelper from '../../../epic-helper/command-helper';
import {userReminderServices} from '@epic-helper/services';

const FARM_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.farm;

interface IRpgFarm {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgFarm({client, message, author, isSlashCommand}: IRpgFarm) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    author,
    client,
    channelId: message.channel.id,
    commandType: RPG_COOLDOWN_EMBED_TYPE.farm,
  });
  if (!event) return;
  event.on('content', async (content, collected) => {
    if (
      isRpgFarmSuccess({content, author}) ||
      isSeedNotGrowingUpEnded({content, author})
    ) {
      await rpgFarmSuccess({
        author,
        client,
        content,
        message,
      });
      event?.stop();
    }
    if (isFarmingInSpace({content, author})) {
      event?.stop();
    }
    if (hasNoSeedToPlant({message: collected, author})) {
      event?.stop();
    }
  });
  event.on('embed', (embed) => {
    if (isSeedNotGrowingUp({embed, author})) {

      // event.stop();
    }
  });
  event.on('cooldown', async (cooldown) => {
    const toggleUser = await toggleUserChecker({
      userId: author.id,
      serverId: message.guild.id,
      client,
    });
    if (!toggleUser?.reminder.farm) return;
    await userReminderServices.updateUserCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      type: RPG_COMMAND_TYPE.farm,
    });
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgFarmSuccess {
  client: Client;
  author: User;
  content: string;
  message: Message<true>;
}

const rpgFarmSuccess = async ({
  content,
  author,
  message,
  client,
}: IRpgFarmSuccess) => {
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
  if (!toggleChecker) return;
  const seedType = whatIsTheSeed(content);

  if (toggleChecker.reminder.farm) {
    const cooldown = await calcCdReduction({
      userId: author.id,
      commandType: RPG_COMMAND_TYPE.farm,
      cooldown: FARM_COOLDOWN,
    });
    await userReminderServices.saveUserFarmCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      seedType,
    });
  }

  await updateReminderChannel({
    client,
    userId: author.id,
    channelId: message.channel.id,
  });

  commandHelper.userStats.countCommand({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.farm,
  });
};

interface IIsRpgFarmSuccess {
  content: string;
  author: User;
}

const isRpgFarmSuccess = ({author, content}: IIsRpgFarmSuccess) =>
  content.includes(author.username) &&
  [
    'have grown from the seed',
    'HITS THE FLOOR WITH THE FISTS',
    'in the ground...',
  ].some((msg) => content.includes(msg));

function whatIsTheSeed(content: string) {
  return Object.values(RPG_FARM_SEED).find(
    (seed) => seed && content.split('\n')[0].includes(seed),
  );
}

interface IIsFarmingInSpace {
  content: string;
  author: User;
}

const isFarmingInSpace = ({content}: IIsFarmingInSpace) =>
  ['no land to plant'].some((msg) => content.includes(msg));

interface IHasNoSeedToPlant {
  message: Message;
  author: User;
}

const hasNoSeedToPlant = ({message, author}: IHasNoSeedToPlant) =>
  message.mentions.has(author.id) &&
  (['you need a', 'seed'].every((msg) => message.content.includes(msg)) ||
    ['you do not have this type of seed'].some((msg) =>
      message.content.includes(msg),
    ));

interface IIsSeedNotGrowingUp {
  embed: Embed;
  author: User;
}

const isSeedNotGrowingUp = ({embed, author}: IIsSeedNotGrowingUp) =>
  embed.description?.includes(
    'You planted a seed, but for some reason it\'s not growing up',
  ) && embed.author?.name === `${author.username} — farm`;

interface IIsFailToPlantAnotherSeed {
  content: string;
  author: User;
}

const isSeedNotGrowingUpEnded = ({
  content,
  author,
}: IIsFailToPlantAnotherSeed) =>
  content.includes(author.username) &&
  [
    'is about to plant another seed',
    'HITS THE FLOOR WITH THEIR FISTS',
    'cried',
  ].some((msg) => content.includes(msg));
