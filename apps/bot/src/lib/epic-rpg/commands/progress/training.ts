import type {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import getTrainingAnswer from '../../../epic-helper/features/training-helper';
import {djsMessageHelper} from '../../../discordjs/message';
import {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {BOT_REMINDER_BASE_COOLDOWN, RPG_COMMAND_TYPE, RPG_COOLDOWN_EMBED_TYPE} from '@epic-helper/constants';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import {userReminderServices} from '@epic-helper/services';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';
import commandHelper from '../../../epic-helper/command-helper';

interface IRpgTraining {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgTraining({
  client,
  message,
  author,
  isSlashCommand,
}: IRpgTraining) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
    commandType: RPG_COOLDOWN_EMBED_TYPE.training,
  });
  if (!event) return;
  event.on('content', async (content) => {
    if (isRpgTrainingQuestion({author, content})) {
      event?.pendingAnswer();
      const messageOptions = await getTrainingAnswer({
        author,
        content,
        serverId: message.guild.id,
        client,
      });
      if (!messageOptions) return;
      await djsMessageHelper.send({
        channelId: message.channel.id,
        client,
        options: messageOptions,
      });
    }

    if (isRpgTrainingSuccess({author, content})) {
      await rpgTrainingSuccess({
        author,
        client,
        message,
      });
    }
  });
  event.on('cooldown', async (cooldown) => {
    const toggleUser = await toggleUserChecker({
      userId: author.id,
      serverId: message.guild.id,
      client,
    });
    if (!toggleUser?.reminder.training) return;
    await userReminderServices.updateUserCooldown({
      userId: author.id,
      type: RPG_COMMAND_TYPE.training,
      readyAt: new Date(Date.now() + cooldown),
    });
  });
  event.on('embed', async (embed, collected) => {
    if (isEncounteringPet({author, embed})) {
      await encounteringPet({
        client,
        author,
        wildPetMessage: collected,
        message,
      });
      event?.stop();
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgTrainingSuccess {
  client: Client;
  author: User;
  message: Message<true>;
}

const TRAINING_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.training;

const rpgTrainingSuccess = async ({
  author,
  message,
  client,
}: IRpgTrainingSuccess) => {
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
  if (!toggleChecker) return;

  if (toggleChecker.reminder.training) {
    const cooldown = await calcCdReduction({
      userId: author.id,
      commandType: RPG_COMMAND_TYPE.training,
      cooldown: TRAINING_COOLDOWN,
    });
    await userReminderServices.saveUserTrainingCooldown({
      userId: author.id,
      ultraining: false,
      readyAt: new Date(Date.now() + cooldown),
    });
  }

  await updateReminderChannel({
    client,
    userId: author.id,
    channelId: message.channelId,
  });

  commandHelper.userStats.countCommand({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.training,
  });
};

interface IEncounteringPet {
  client: Client;
  author: User;
  wildPetMessage: Message;
  message: Message<true>;
}

export const encounteringPet = async ({
  author,
  client,
  message,
  wildPetMessage,
}: IEncounteringPet) => {
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
  if (!toggleChecker?.petCatch) return;

  const petCatch = commandHelper.pet.petCatch({
    embed: wildPetMessage.embeds[0],
    author,
    client,
    toggleUserChecker: toggleChecker,
  });
  await djsMessageHelper.send({
    options: petCatch.render(),
    channelId: message.channel.id,
    client,
  });
  await petCatch.sendCopyCommands(message.channel.id);
};

interface IIsRpgTrainingSuccess {
  content: Message['content'];
  author: User;
}

const isRpgTrainingSuccess = ({author, content}: IIsRpgTrainingSuccess) => {
  return (
    content.includes(author.username) &&
    ['Well done', 'Better luck next time'].some((msg) => content.includes(msg))
  );
};

interface IIsRpgTrainingQuestion {
  content: Message['content'];
  author: User;
}

const isRpgTrainingQuestion = ({author, content}: IIsRpgTrainingQuestion) => {
  return (
    content.includes(author.username) && content.includes('is training in')
  );
};

interface IIsEncounteringPet {
  embed: Embed;
  author: User;
}

const isEncounteringPet = ({embed, author}: IIsEncounteringPet) =>
  [author.username, 'IS APPROACHING'].every((msg) =>
    embed.fields[0]?.name?.includes(msg),
  );
