import {IUser} from '@epic-helper/models';
import {EmbedBuilder, User} from 'discord.js';
import {ValuesOf} from '@epic-helper/ts-utils';
import {BOT_COLOR, RPG_COMMAND_TYPE} from '@epic-helper/constants';

interface IGetUserReminderChannelEmbed {
  userProfile: IUser;
  author: User;
}

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
        name: 'Horse',
      },
      {
        type: RPG_COMMAND_TYPE.arena,
        name: 'Arena',
      },
      {
        type: RPG_COMMAND_TYPE.dungeon,
        name: 'Dungeon',
      },
    ],
  },
  {
    name: '🧩 Other',
    value: [
      {
        type: RPG_COMMAND_TYPE.pet,
        name: 'Pet',
      },
      {
        type: RPG_COMMAND_TYPE.use,
        name: 'Epic Items',
      },
    ],
  },
];

const getUserReminderChannelEmbed = ({userProfile, author}: IGetUserReminderChannelEmbed) => {
  const embed = new EmbedBuilder()
    .setAuthor({
      name: `${author.username}'s reminder channel`,
      iconURL: author.avatarURL() ?? undefined,
    })
    .setColor(BOT_COLOR.embed)
    .setThumbnail(author.avatarURL())
    .setDescription(`**Default**: <#${userProfile.channel.all}>`);

  for (let field of cmd) {
    const fieldName = field.name;
    const channels: string[] = [];
    for (let item of field.value) {
      const channel = userProfile.channel[item.type];
      if (channel) {
        channels.push(`**${item.name}**: <#${channel}>`);
      } else {
        channels.push(`**${item.name}**: -`);
      }
    }
    embed.addFields({
      name: fieldName,
      value: channels.join('\n'),
      inline: false,
    });
  }
  embed.addFields({
    name: 'Info',
    value: 'Use `/config user reminder-channel` to customize your reminder channel.',
  });
  return embed;
};

export default getUserReminderChannelEmbed;
