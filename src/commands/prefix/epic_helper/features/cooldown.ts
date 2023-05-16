import {BOT_COLOR, COMMAND_TYPE} from '../../../../constants/bot';
import {getUserAllCooldowns} from '../../../../models/user-reminder/user-reminder.service';
import {
  IAdventureReminderProps,
  IFarmReminderProps,
  IHuntReminderProps,
  IQuestReminderProps,
  ITrainingReminderProps,
  IWorkingReminderProps,
} from '../../../../models/user-reminder/user-reminder.type';
import {EmbedBuilder} from 'discord.js';
import sendMessage from '../../../../lib/discord.js/message/sendMessage';
import {RPG_COMMAND_TYPE} from '../../../../constants/rpg';
import dynamicTimeStamp from '../../../../utils/discord/dynamicTimestamp';

const EMOJI = {
  ready: '<:on:863824531445121034>',
  notReady: '🕓',
};

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

export default <PrefixCommand>{
  name: 'ehCooldown',
  commands: ['cooldowns', 'cooldown', 'cd'],
  type: COMMAND_TYPE.bot,
  execute: async (client, message) => {
    const cooldowns = await getUserAllCooldowns(message.author.id);
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${message.author.username}'s cooldowns`,
        iconURL: message.author.avatarURL() || undefined,
      })
      .setColor(BOT_COLOR.embed);

    const fields = [];
    for (const field of cmd) {
      const value = [];
      for (const item of field.value) {
        const cooldown = cooldowns.find((c) => c.type === item.type);
        if (cooldown) {
          value.push(
            `${EMOJI.notReady} ~-~ \`${item.name(cooldown.props)}\` (${dynamicTimeStamp({
              time: cooldown.readyAt,
            })})`
          );
        } else if (!field.skipIfNone) {
          value.push(`${EMOJI.ready} ~-~ \`${item.name({})}\``);
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
    await sendMessage({
      channelId: message.channel.id,
      client,
      options: {embeds: [embed]},
    });
  },
};
