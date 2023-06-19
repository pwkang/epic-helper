import timestampHelper from '../../discord.js/timestamp';
import {ValuesOf} from '@epic-helper/ts-utils';
import {BOT_COLOR, BOT_EMOJI, RPG_COMMAND_TYPE} from '@epic-helper/constants';
import {
  IAdventureReminderProps,
  IFarmReminderProps,
  IHuntReminderProps,
  IQuestReminderProps,
  ITrainingReminderProps,
  IUserReminder,
  IWorkingReminderProps,
} from '@epic-helper/models';
import {EmbedBuilder, User} from 'discord.js';

interface ICooldownItem {
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
  name: (props: any) => string;
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
        name: () => 'Daily',
      },
      {
        type: RPG_COMMAND_TYPE.weekly,
        name: () => 'Weekly',
      },
      {
        type: RPG_COMMAND_TYPE.lootbox,
        name: () => 'Lootbox',
      },
      {
        type: RPG_COMMAND_TYPE.vote,
        name: () => 'Vote',
      },
    ],
  },
  {
    name: '<:sword:886278799975678043> Experience',
    value: [
      {
        type: RPG_COMMAND_TYPE.hunt,
        name: (props: IHuntReminderProps) =>
          `Hunt${props?.hardMode ? ' Hardmode' : ''}${props?.together ? ' Together' : ''}`,
      },
      {
        type: RPG_COMMAND_TYPE.adventure,
        name: (props: IAdventureReminderProps) => `Adventure${props?.hardMode ? ' Hardmode' : ''}`,
      },
      {
        type: RPG_COMMAND_TYPE.training,
        name: (props: ITrainingReminderProps) => (props?.ultraining ? 'Ultraining' : 'Training'),
      },
      {
        type: RPG_COMMAND_TYPE.duel,
        name: () => 'Duel',
      },
      {
        type: RPG_COMMAND_TYPE.quest,
        name: (props: IQuestReminderProps) => (props?.epicQuest ? 'Epic Quest' : 'Quest'),
      },
    ],
  },
  {
    name: '✨ Progress',
    value: [
      {
        type: RPG_COMMAND_TYPE.working,
        name: (props: IWorkingReminderProps) =>
          props?.workingType ? props.workingType : 'Working',
      },
      {
        type: RPG_COMMAND_TYPE.farm,
        name: (props: IFarmReminderProps) => `farm${props?.seedType ? ` ${props?.seedType}` : ''}`,
      },
      {
        type: RPG_COMMAND_TYPE.horse,
        name: () => 'Horse Breeding | Horse Race',
      },
      {
        type: RPG_COMMAND_TYPE.arena,
        name: () => 'Arena',
      },
      {
        type: RPG_COMMAND_TYPE.dungeon,
        name: () => 'Dungeon | Miniboss',
      },
    ],
  },
  {
    name: '🧩 Other',
    skipIfNone: true,
    value: [],
  },
];

interface IGetUserCooldownEmbedProps {
  author: User;
  userReminder: IUserReminder[];
}

const getUserCooldownEmbed = ({userReminder, author}: IGetUserCooldownEmbedProps) => {
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
      if (cooldown && cooldown.readyAt.getTime() > Date.now()) {
        const readyIn = timestampHelper.relative({
          time: cooldown.readyAt,
        });
        value.push(`${BOT_EMOJI.utils.notReady} ~-~ \`${item.name(cooldown.props)}\` (${readyIn})`);
      } else if (!field.skipIfNone) {
        value.push(`${BOT_EMOJI.utils.ready} ~-~ \`${item.name({})}\``);
      }
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
