import {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import getTrainingAnswer from '../../../epic-helper/features/training-helper';
import {djsMessageHelper} from '../../../discordjs/message';
import {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {
  BOT_REMINDER_BASE_COOLDOWN,
  RPG_COMMAND_TYPE,
  RPG_COOLDOWN_EMBED_TYPE,
} from '@epic-helper/constants';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import {userStatsService} from '../../../../services/database/user-stats.service';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';
import embedReaders from '../../embed-readers';
import {generatePetCatchMessageOptions} from '../../utils/pet-catch-cmd';
import messageFormatter from '../../../discordjs/message-formatter';

interface IRpgTraining {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
}

export function rpgTraining({client, message, author, isSlashCommand}: IRpgTraining) {
  const event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
    commandType: RPG_COOLDOWN_EMBED_TYPE.training,
  });
  if (!event) return;
  event.on('content', async (content) => {
    if (isRpgTrainingQuestion({author, content})) {
      event.pendingAnswer();
      const answer = await getTrainingAnswer({author, content});
      if (!answer) return;
      await djsMessageHelper.send({
        channelId: message.channel.id,
        client,
        options: {
          components: answer,
        },
      });
    }

    if (isRpgTrainingSuccess({author, content})) {
      await rpgTrainingSuccess({
        author,
        channelId: message.channel.id,
        client,
      });
    }
  });
  event.on('cooldown', async (cooldown) => {
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
        embed,
        channelId: message.channel.id,
        wildPetMessage: collected,
      });
      event.stop();
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgTrainingSuccess {
  client: Client;
  channelId: string;
  author: User;
}

const TRAINING_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.training;

const rpgTrainingSuccess = async ({author, channelId}: IRpgTrainingSuccess) => {
  const toggleChecker = await toggleUserChecker({userId: author.id});
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
    userId: author.id,
    channelId,
  });

  await userStatsService.countUserStats({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.training,
  });
};

interface IEncounteringPet {
  client: Client;
  embed: Embed;
  author: User;
  channelId: string;
  wildPetMessage: Message;
}

const encounteringPet = async ({
  embed,
  author,
  client,
  channelId,
  wildPetMessage,
}: IEncounteringPet) => {
  const toggleChecker = await toggleUserChecker({userId: author.id});
  if (!toggleChecker?.petCatch) return;

  const info = embedReaders.wildPet({
    embed,
  });
  const messageOptions = generatePetCatchMessageOptions({info});
  await djsMessageHelper.send({
    options: {
      ...messageOptions,
      content: toggleChecker?.mentions.petCatch ? messageFormatter.user(author.id) : undefined,
    },
    channelId,
    client,
  });
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
  return content.includes(author.username) && content.includes('is training in');
};

interface IIsEncounteringPet {
  embed: Embed;
  author: User;
}

const isEncounteringPet = ({embed, author}: IIsEncounteringPet) =>
  [author.username, 'IS APPROACHING'].every((msg) => embed.fields[0]?.name?.includes(msg));
