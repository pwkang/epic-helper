import {RPG_COMMAND_TYPE, RPG_WORKING_TYPE} from '../../../../constants/epic_rpg/rpg';
import {Client, Embed, Message, User} from 'discord.js';
import {
  saveUserWorkingCooldown,
  updateUserCooldown,
} from '../../../../models/user-reminder/user-reminder.service';
import {COMMAND_BASE_COOLDOWN} from '../../../../constants/epic_helper/command_base_cd';
import {calcReducedCd} from '../../../../utils/epic_rpg/calcReducedCd';
import {createRpgCommandListener} from '../../createRpgCommandListener';
import {updateUserRubyAmount} from '../../../../models/user/user.service';
import replyMessage from '../../../discord.js/message/replyMessage';
import {updateReminderChannel} from '../../../../utils/reminderChannel';
import {countUserStats} from '../../../../models/user-stats/user-stats.service';
import {USER_STATS_RPG_COMMAND_TYPE} from '../../../../models/user-stats/user-stats.types';

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

const WORKING_COOLDOWN = COMMAND_BASE_COOLDOWN.working;

interface IRpgWorking {
  client: Client;
  message: Message;
  author: User;
  isSlashCommand: boolean;
  workingType: ValuesOf<typeof RPG_WORKING_TYPE>;
}

export function rpgWorking({client, message, author, isSlashCommand, workingType}: IRpgWorking) {
  const event = createRpgCommandListener({
    channelId: message.channel.id,
    client,
    author,
  });
  if (!event) return;
  event.on('content', async (content) => {
    if (isRpgWorkingSuccess({author, content})) {
      await rpgWorkingSuccess({
        client,
        channelId: message.channel.id,
        author,
        workingType,
      });
      event.stop();
    }
    if (isWorkingInSpace({author, content})) {
      event.stop();
    }
    if (isRubyMined({author, content})) {
      const mined = rubyAmountMined({author, content});
      await updateUserRubyAmount({
        userId: author.id,
        type: 'inc',
        ruby: mined,
      });
      event.stop();
    }
    if (isFoughtRubyDragon({author, content})) {
      await updateUserRubyAmount({
        userId: author.id,
        type: 'inc',
        ruby: 10,
      });
      event.stop();
      replyMessage({
        client,
        message,
        options: {
          content: 'You were moved to another area, remember to go back your area!',
        },
      });
    }
  });
  event.on('cooldown', (cooldown) => {
    updateUserCooldown({
      userId: author.id,
      type: RPG_COMMAND_TYPE.working,
      readyAt: new Date(Date.now() + cooldown),
    });
  });
  event.on('embed', (embed) => {
    if (isEncounteringRubyDragon({embed, author})) {
      event.pendingAnswer();
      event.resetTimer(30000);
    }
  });
  if (isSlashCommand) event.triggerCollect(message);
}

interface IRpgWorkingSuccess {
  client: Client;
  channelId: string;
  author: User;
  workingType?: ValuesOf<typeof RPG_WORKING_TYPE>;
}

export default async function rpgWorkingSuccess({
  author,
  workingType,
  channelId,
}: IRpgWorkingSuccess) {
  const cooldown = await calcReducedCd({
    userId: author.id,
    commandType: RPG_COMMAND_TYPE.working,
    cooldown: WORKING_COOLDOWN,
  });
  await saveUserWorkingCooldown({
    userId: author.id,
    workingType,
    readyAt: new Date(Date.now() + cooldown),
  });
  updateReminderChannel({
    userId: author.id,
    channelId,
  });

  countUserStats({
    userId: author.id,
    type: USER_STATS_RPG_COMMAND_TYPE.working,
  });
}

interface IIsRpgWorkingSuccess {
  content: string;
  author: User;
}

export const isRpgWorkingSuccess = ({author, content}: IIsRpgWorkingSuccess) =>
  content.includes(author.username) &&
  WORKING_ITEMS.some((item) => content.toLowerCase().includes(item));

interface IIsWorkingInSpace {
  content: string;
  author: User;
}

export const isWorkingInSpace = ({content}: IIsWorkingInSpace) =>
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

export const isRubyMined = ({content, author}: IIsRubyMined) =>
  [author.username, 'GOT', '<:ruby:603456286184701953>'].every((msg) => content.includes(msg));

interface IRubyAmountMined {
  content: string;
  author: User;
}

export const rubyAmountMined = ({content}: IRubyAmountMined) => {
  const regex = new RegExp('GOT (\\d+) <:ruby:603456286184701953>');
  const match = content.match(regex);
  return match ? parseInt(match[1]) : 0;
};

interface IIsEncounteringRubyDragon {
  embed: Embed;
  author: User;
}

export const isEncounteringRubyDragon = ({embed, author}: IIsEncounteringRubyDragon) =>
  embed.description?.includes('No matter how much you look around') &&
  embed.author?.name.includes(author.username);

interface IIsFoughtRubyDragon {
  content: string;
  author: User;
}

export const isFoughtRubyDragon = ({content, author}: IIsFoughtRubyDragon) =>
  [author.username, 'fights', 'THE RUBY DRAGON'].every((msg) => content.includes(msg));
