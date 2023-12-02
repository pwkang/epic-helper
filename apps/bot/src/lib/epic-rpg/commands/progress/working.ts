import type {RPG_WORKING_TYPE} from '@epic-helper/constants';
import {
  BOT_REMINDER_BASE_COOLDOWN,
  RPG_COMMAND_TYPE,
  RPG_COOLDOWN_EMBED_TYPE,
} from '@epic-helper/constants';
import type {Client, Embed, Message, User} from 'discord.js';
import {createRpgCommandListener} from '../../../../utils/rpg-command-listener';
import {USER_STATS_RPG_COMMAND_TYPE} from '@epic-helper/models';
import {djsMessageHelper} from '../../../discordjs/message';
import {calcCdReduction} from '../../../epic-helper/reminders/commands-cooldown';
import {updateReminderChannel} from '../../../epic-helper/reminders/reminder-channel';
import {userService} from '../../../../services/database/user.service';
import {userReminderServices} from '../../../../services/database/user-reminder.service';
import toggleUserChecker from '../../../epic-helper/toggle-checker/user';
import commandHelper from '../../../epic-helper/command-helper';

const WORKING_ITEMS = [
  'normie fish',
  'golden fish',
  'epic fish',
  'wooden log',
  'epic log',
  'super log',
  'mega',
  'hyper',
  'ultra',
  'apple',
  'banana',
  'ruby',
  'coins',
  'rubies',
  'nothing',
];

const WORKING_COOLDOWN = BOT_REMINDER_BASE_COOLDOWN.working;

interface IRpgWorking {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
  workingType: ValuesOf<typeof RPG_WORKING_TYPE>;
}

export function rpgWorking({
  client,
  message,
  author,
  isSlashCommand,
  workingType,
}: IRpgWorking) {
  if (!message.inGuild()) return;
  let event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
    commandType: RPG_COOLDOWN_EMBED_TYPE.working,
  });
  if (!event) return;
  event.on('content', async (content) => {
    if (isRpgWorkingSuccess({author, content})) {
      await rpgWorkingSuccess({
        client,
        author,
        workingType,
        message,
      });
      event?.stop();
    }
    if (isWorkingInSpace({author, content})) {
      event?.stop();
    }
    if (isRubyMined({author, content})) {
      const mined = rubyAmountMined({author, content});
      await userService.updateUserRubyAmount({
        userId: author.id,
        type: 'inc',
        ruby: mined,
      });
      event?.stop();
    }
    if (isFoughtRubyDragon({author, content})) {
      await userService.updateUserRubyAmount({
        userId: author.id,
        type: 'inc',
        ruby: 10,
      });
      event?.stop();
      await djsMessageHelper.reply({
        client,
        message,
        options: {
          content:
            'You were moved to another area, remember to go back your area!',
        },
      });
    }
  });
  event.on('cooldown', async (cooldown) => {
    const toggleUser = await toggleUserChecker({
      userId: author.id,
      serverId: message.guild.id,
      client,
    });
    if(!toggleUser?.reminder.working) return;
    await userReminderServices.updateUserCooldown({
      userId: author.id,
      type: RPG_COMMAND_TYPE.working,
      readyAt: new Date(Date.now() + cooldown),
    });
  });
  event.on('embed', (embed) => {
    if (isEncounteringRubyDragon({embed, author})) {
      event?.pendingAnswer();
      event?.resetTimer(30000);
    }
  });
  event.on('end', () => {
    event = undefined;
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgWorkingSuccess {
  client: Client;
  author: User;
  workingType?: ValuesOf<typeof RPG_WORKING_TYPE>;
  message: Message<true>;
}

const rpgWorkingSuccess = async ({
  author,
  workingType,
  client,
  message,
}: IRpgWorkingSuccess) => {
  const toggleChecker = await toggleUserChecker({
    userId: author.id,
    client,
    serverId: message.guild.id,
  });
  if (!toggleChecker) return;

  if (toggleChecker.reminder.working) {
    const cooldown = await calcCdReduction({
      userId: author.id,
      commandType: RPG_COMMAND_TYPE.working,
      cooldown: WORKING_COOLDOWN,
    });
    await userReminderServices.saveUserWorkingCooldown({
      userId: author.id,
      workingType,
      readyAt: new Date(Date.now() + cooldown),
    });
  }

  await updateReminderChannel({
    userId: author.id,
    channelId: message.channel.id,
  });

  commandHelper.userStats.countCommand({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.working,
  });
};

interface IIsRpgWorkingSuccess {
  content: string;
  author: User;
}

const isRpgWorkingSuccess = ({author, content}: IIsRpgWorkingSuccess) =>
  content.includes(author.username) &&
  WORKING_ITEMS.some((item) => content.toLowerCase().includes(item));

interface IIsWorkingInSpace {
  content: string;
  author: User;
}

const isWorkingInSpace = ({content}: IIsWorkingInSpace) =>
  [
    'no trees to chop',
    'what are you going to mine?',
    'you can\'t pick "up" stuff',
    'there are fish in space',
  ].some((msg) => content.includes(msg));

interface IIsRubyMined {
  content: string;
  author: User;
}

const isRubyMined = ({content, author}: IIsRubyMined) =>
  [author.username, 'GOT', '<:ruby:603456286184701953>'].every((msg) =>
    content.includes(msg),
  );

interface IRubyAmountMined {
  content: string;
  author: User;
}

const rubyAmountMined = ({content}: IRubyAmountMined) => {
  const regex = new RegExp('GOT (\\d+) <:ruby:603456286184701953>');
  const match = content.match(regex);
  return match ? parseInt(match[1]) : 0;
};

interface IIsEncounteringRubyDragon {
  embed: Embed;
  author: User;
}

const isEncounteringRubyDragon = ({embed, author}: IIsEncounteringRubyDragon) =>
  embed.description?.includes('No matter how much you look around') &&
  embed.author?.name.includes(author.username);

interface IIsFoughtRubyDragon {
  content: string;
  author: User;
}

const isFoughtRubyDragon = ({content, author}: IIsFoughtRubyDragon) =>
  [author.username, 'fights', 'THE RUBY DRAGON'].every((msg) =>
    content.includes(msg),
  );
