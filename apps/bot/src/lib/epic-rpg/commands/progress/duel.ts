import {
  BOT_REMINDER_BASE_COOLDOWN,
  RPG_COMMAND_TYPE,
  RPG_COOLDOWN_EMBED_TYPE,
} from '@epic-helper/constants';
import type {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';
import commandHelper from '../../../epic-helper/command-helper';
import {userService} from '../../../../services/database/user.service';

const DUEL_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.duel;

interface IRpgDuel {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
  targetUser?: User;
}

export function rpgDuel({
  client,
  message,
  author,
  isSlashCommand,
  targetUser,
}: IRpgDuel) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    author,
    channelId: message.channel.id,
    client,
    commandType: RPG_COOLDOWN_EMBED_TYPE.duel,
  });
  if (!event) return;
  event.on('embed', async (embed, collected) => {
    if (isRpgDuelRequest({embed, author})) {
      event?.resetTimer(30000);
    }
    if (isRpgDuelWeapon({embed, author})) {
      event?.resetTimer(30000);
    }
    if (isRpgDuelEnded({embed, author})) {
      const users = [author];
      if (targetUser) users.push(targetUser);
      users.map((user) => {
        rpgDuelSuccess({
          author: user,
          client,
          message,
        });
      });
      commandHelper.duel.autoAdd({
        users,
        duelMessage: collected,
        client,
      });
      event?.stop();
    }
  });
  event.on('cooldown', async (cooldown) => {
    await userReminderServices.updateUserCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
      type: RPG_COMMAND_TYPE.duel,
    });
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgDuelSuccess {
  client: Client;
  author: User;
  message: Message<true>;
}

const rpgDuelSuccess = async ({author, message, client}: IRpgDuelSuccess) => {
  const isUserAccountOn = await userService.isUserAccountOn({
    userId: author.id,
  });
  if (!isUserAccountOn) return;
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
  if (!toggleChecker) return;

  if (toggleChecker.reminder.duel) {
    const cooldown = await calcCdReduction({
      userId: author.id,
      commandType: RPG_COMMAND_TYPE.duel,
      cooldown: DUEL_COOLDOWN,
    });
    await userReminderServices.saveUserDuelCooldown({
      userId: author.id,
      readyAt: new Date(Date.now() + cooldown),
    });
  }

  await updateReminderChannel({
    userId: author.id,
    channelId: message.channel.id,
  });
};

interface IIsRpgDuelSuccess {
  embed: Embed;
  author: User;
}

const isRpgDuelRequest = ({embed, author}: IIsRpgDuelSuccess) =>
  embed.author?.name === `${author.username} — duel` &&
  !!embed.description?.includes(`**${author.username}** sent a Duel`);

const isRpgDuelEnded = ({embed, author}: IIsRpgDuelSuccess) =>
  embed.author?.name === `${author.username} — duel` &&
  !!embed.fields[0]?.value?.includes('Reward: ');

const isRpgDuelWeapon = ({embed, author}: IIsRpgDuelSuccess) =>
  embed.author?.name === `${author.username} — duel` &&
  !!embed.description?.includes('choose the weapon that better fits with you');
