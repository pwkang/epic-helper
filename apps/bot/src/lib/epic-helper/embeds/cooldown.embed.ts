import timestampHelper from '../../discordjs/timestamp';
import {BOT_COLOR, BOT_EMOJI, RPG_COMMAND_TYPE} from '@epic-helper/constants';
import type {IUser, IUserReminder} from '@epic-helper/models';
import type {User} from 'discord.js';
import {EmbedBuilder} from 'discord.js';
import {_parseCommandString} from '../reminders/message-generator/parse-command-name';
import {capitalizeFirstLetters} from '@epic-helper/utils';
import type {IToggleUserCheckerReturnType} from '../toggle-checker/user';

interface ICooldownItem {
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
  name: string;
}

interface ICooldown {
  name: string;
  skipIfNone?: boolean;
  value: ICooldownItem[];
}

const cmd: ICooldown[] = [
  {
    name: '🎁 Rewards',
    value: [
      {
        type: RPG_COMMAND_TYPE.daily,
        name: 'Daily',
      },
      {
        type: RPG_COMMAND_TYPE.weekly,
        name: 'Weekly',
      },
      {
        type: RPG_COMMAND_TYPE.lootbox,
        name: 'Lootbox',
      },
      {
        type: RPG_COMMAND_TYPE.vote,
        name: 'Vote',
      },
    ],
  },
  {
    name: '<:sword:886278799975678043> Experience',
    value: [
      {
        type: RPG_COMMAND_TYPE.hunt,
        name: 'Hunt',
      },
      {
        type: RPG_COMMAND_TYPE.adventure,
        name: 'Adventure',
      },
      {
        type: RPG_COMMAND_TYPE.training,
        name: 'Training',
      },
      {
        type: RPG_COMMAND_TYPE.duel,
        name: 'Duel',
      },
      {
        type: RPG_COMMAND_TYPE.quest,
        name: 'Quest',
      },
    ],
  },
  {
    name: '✨ Progress',
    value: [
      {
        type: RPG_COMMAND_TYPE.working,
        name: 'Working',
      },
      {
        type: RPG_COMMAND_TYPE.farm,
        name: 'Farm',
      },
      {
        type: RPG_COMMAND_TYPE.horse,
        name: 'Horse Breeding | Horse Race',
      },
      {
        type: RPG_COMMAND_TYPE.arena,
        name: 'Arena',
      },
      {
        type: RPG_COMMAND_TYPE.dungeon,
        name: 'Dungeon | Miniboss',
      },
    ],
  },
  {
    name: '🧩 Other',
    skipIfNone: true,
    value: [],
  },
];

export interface IGetUserCooldownEmbedProps {
  author: User;
  userReminder: IUserReminder[];
  userAccount: IUser;
  toggleChecker: IToggleUserCheckerReturnType;
}

const getUserCooldownEmbed = ({
  userReminder,
  author,
  toggleChecker,
}: IGetUserCooldownEmbedProps) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${author.username}'s cooldowns`,
      iconURL: author.avatarURL() || undefined,
    })
    .setColor(BOT_COLOR.embed);

  const fields = [];
  for (const field of cmd) {
    const value = [];
    for (const item of field.value) {
      const cooldown = userReminder.find((c) => c.type === item.type);
      const commandName = cooldown
        ? _parseCommandString({
          toggleChecker,
          ...cooldown,
        }).replace('RPG ', '')
        : item.name;
      const readyIn =
        !!cooldown?.readyAt &&
        cooldown.readyAt.getTime() > Date.now() &&
        timestampHelper.relative({
          time: cooldown.readyAt,
        });
      const icon =
        cooldown?.readyAt && cooldown?.readyAt.getTime() > Date.now()
          ? BOT_EMOJI.utils.notReady
          : BOT_EMOJI.utils.ready;
      const formattedCommandName = capitalizeFirstLetters(commandName);
      const readyString = readyIn ? ` (${readyIn})` : '';
      value.push(`${icon} ~-~ \`${formattedCommandName}\`${readyString}`);
    }
    if (value.length > 0) {
      fields.push({
        name: field.name,
        value: value.join('\n'),
      });
    }
  }
  embed.addFields(fields);
  return embed;
};

export default getUserCooldownEmbed;
