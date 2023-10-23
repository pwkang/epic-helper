import type {IToggleEmbedsInfo} from './toggle.embed';
import type {IGuild, IServerToggle, IUserToggle} from '@epic-helper/models';

export const donor = (userToggle: IUserToggle): IToggleEmbedsInfo[] => {
  return [
    {
      id: 'common',
      title: 'Common Features',
      inline: true,
      children: [
        {
          value: userToggle.training.all,
          label: 'Give answer on training',
          path: 'toggle.training.all',
          children: [
            {
              value: userToggle.training.ruby,
              path: 'toggle.training.ruby',
              label: 'Ruby question',
            },
            {
              value: userToggle.training.basic,
              path: 'toggle.training.basic',
              label: 'Other questions',
            },
          ],
        },
        {
          value: userToggle.petCatch,
          path: 'toggle.petCatch',
          label: 'Give actions to catch pet',
        },
        {
          value: userToggle.emoji,
          path: 'toggle.emoji',
          label: 'Reminder emoji',
        },
        {
          value: userToggle.quest.all,
          path: 'toggle.quest.all',
          label: 'Show cooldown on quest',
          children: [
            {
              value: userToggle.quest.arena,
              path: 'toggle.quest.arena',
              label: 'Arena',
            },
            {
              value: userToggle.quest.miniboss,
              path: 'toggle.quest.miniboss',
              label: 'Miniboss',
            },
          ],
        },
        {
          value: userToggle.heal,
          path: 'toggle.heal',
          label: 'Heal reminder',
        },
        {
          value: userToggle.slash,
          path: 'toggle.slash',
          label: 'Reminder with slash commands',
        },
        {
          value: userToggle.countdown.all,
          path: 'toggle.countdown.all',
          label: 'Show upcoming reminder countdown',
        },
        {
          value: userToggle.huntSwitch,
          path: 'toggle.huntSwitch',
          label: 'Switch hunt reminder between `hunt` & `hunt t`',
        },
      ],
    },
    {
      id: 'reminder',
      title: 'Custom Reminder',
      value: userToggle.reminder.all,
      path: 'toggle.reminder.all',
      inline: true,
      children: [
        {
          value: userToggle.reminder.all,
          path: 'toggle.reminder.all',
          label: 'All',
        },
        {
          value: userToggle.reminder.daily,
          path: 'toggle.reminder.daily',
          label: 'Daily',
        },
        {
          value: userToggle.reminder.weekly,
          path: 'toggle.reminder.weekly',
          label: 'Weekly',
        },
        {
          value: userToggle.reminder.lootbox,
          path: 'toggle.reminder.lootbox',
          label: 'Lootbox',
        },
        {
          value: userToggle.reminder.vote,
          path: 'toggle.reminder.vote',
          label: 'Vote',
        },
        {
          value: userToggle.reminder.hunt,
          path: 'toggle.reminder.hunt',
          label: 'Hunt',
        },
        {
          value: userToggle.reminder.adventure,
          path: 'toggle.reminder.adventure',
          label: 'Adventure',
        },
        {
          value: userToggle.reminder.training,
          path: 'toggle.reminder.training',
          label: 'Training',
        },
        {
          value: userToggle.reminder.duel,
          path: 'toggle.reminder.duel',
          label: 'Duel',
        },
        {
          value: userToggle.reminder.quest,
          path: 'toggle.reminder.quest',
          label: 'Quest',
        },
        {
          value: userToggle.reminder.working,
          path: 'toggle.reminder.working',
          label: 'Working',
        },
        {
          value: userToggle.reminder.farm,
          path: 'toggle.reminder.farm',
          label: 'Farm',
        },
        {
          value: userToggle.reminder.horse,
          path: 'toggle.reminder.horse',
          label: 'Horse',
        },
        {
          value: userToggle.reminder.arena,
          path: 'toggle.reminder.arena',
          label: 'Arena',
        },
        {
          value: userToggle.reminder.dungeon,
          path: 'toggle.reminder.dungeon',
          label: 'Dungeon',
        },
        {
          value: userToggle.reminder.epicItem,
          path: 'toggle.reminder.epicItem',
          label: 'Epic Items',
        },
        {
          value: userToggle.reminder.pet,
          path: 'toggle.reminder.pet',
          label: 'Pets',
        },
      ],
    },
    {
      id: 'dm',
      title: 'Custom DMs',
      value: userToggle.dm.all,
      path: 'toggle.dm.all',
      inline: true,
      children: [
        {
          value: userToggle.dm.all,
          path: 'toggle.dm.all',
          label: 'All',
        },
        {
          value: userToggle.dm.daily,
          path: 'toggle.dm.daily',
          label: 'Daily',
        },
        {
          value: userToggle.dm.weekly,
          path: 'toggle.dm.weekly',
          label: 'Weekly',
        },
        {
          value: userToggle.dm.lootbox,
          path: 'toggle.dm.lootbox',
          label: 'Lootbox',
        },
        {
          value: userToggle.dm.vote,
          path: 'toggle.dm.vote',
          label: 'Vote',
        },
        {
          value: userToggle.dm.hunt,
          path: 'toggle.dm.hunt',
          label: 'Hunt',
        },
        {
          value: userToggle.dm.adventure,
          path: 'toggle.dm.adventure',
          label: 'Adventure',
        },
        {
          value: userToggle.dm.training,
          path: 'toggle.dm.training',
          label: 'Training',
        },
        {
          value: userToggle.dm.duel,
          path: 'toggle.dm.duel',
          label: 'Duel',
        },
        {
          value: userToggle.dm.quest,
          path: 'toggle.dm.quest',
          label: 'Quest',
        },
        {
          value: userToggle.dm.working,
          path: 'toggle.dm.working',
          label: 'Working',
        },
        {
          value: userToggle.dm.farm,
          path: 'toggle.dm.farm',
          label: 'Farm',
        },
        {
          value: userToggle.dm.horse,
          path: 'toggle.dm.horse',
          label: 'Horse',
        },
        {
          value: userToggle.dm.arena,
          path: 'toggle.dm.arena',
          label: 'Arena',
        },
        {
          value: userToggle.dm.dungeon,
          path: 'toggle.dm.dungeon',
          label: 'Dungeon',
        },
        {
          value: userToggle.dm.epicItem,
          path: 'toggle.dm.epicItem',
          label: 'Epic Items',
        },
        {
          value: userToggle.dm.pet,
          path: 'toggle.dm.pet',
          label: 'Pets',
        },
      ],
    },
    {
      id: 'mentions',
      title: 'Custom Mentions',
      value: userToggle.mentions.all,
      path: 'toggle.mentions.all',
      inline: true,
      children: [
        {
          value: userToggle.mentions.all,
          path: 'toggle.mentions.all',
          label: 'All',
        },
        {
          value: userToggle.mentions.daily,
          path: 'toggle.mentions.daily',
          label: 'Daily',
        },
        {
          value: userToggle.mentions.weekly,
          path: 'toggle.mentions.weekly',
          label: 'Weekly',
        },
        {
          value: userToggle.mentions.lootbox,
          path: 'toggle.mentions.lootbox',
          label: 'Lootbox',
        },
        {
          value: userToggle.mentions.vote,
          path: 'toggle.mentions.vote',
          label: 'Vote',
        },
        {
          value: userToggle.mentions.hunt,
          path: 'toggle.mentions.hunt',
          label: 'Hunt',
        },
        {
          value: userToggle.mentions.adventure,
          path: 'toggle.mentions.adventure',
          label: 'Adventure',
        },
        {
          value: userToggle.mentions.training,
          path: 'toggle.mentions.training',
          label: 'Training',
        },
        {
          value: userToggle.mentions.duel,
          path: 'toggle.mentions.duel',
          label: 'Duel',
        },
        {
          value: userToggle.mentions.quest,
          path: 'toggle.mentions.quest',
          label: 'Quest',
        },
        {
          value: userToggle.mentions.working,
          path: 'toggle.mentions.working',
          label: 'Working',
        },
        {
          value: userToggle.mentions.farm,
          path: 'toggle.mentions.farm',
          label: 'Farm',
        },
        {
          value: userToggle.mentions.horse,
          path: 'toggle.mentions.horse',
          label: 'Horse',
        },
        {
          value: userToggle.mentions.arena,
          path: 'toggle.mentions.arena',
          label: 'Arena',
        },
        {
          value: userToggle.mentions.dungeon,
          path: 'toggle.mentions.dungeon',
          label: 'Dungeon',
        },
        {
          value: userToggle.mentions.epicItem,
          path: 'toggle.mentions.epicItem',
          label: 'Epic Items',
        },
        {
          value: userToggle.mentions.pet,
          path: 'toggle.mentions.pet',
          label: 'Pets',
        },
        {
          value: userToggle.mentions.petCatch,
          path: 'toggle.mentions.petCatch',
          label: 'Pet Catch',
        },
        {
          value: userToggle.mentions.trainingAnswer,
          path: 'toggle.mentions.trainingAnswer',
          label: 'Training Answer',
        },
      ],
    },
  ];
};

export const nonDonor = (userToggle: IUserToggle): IToggleEmbedsInfo[] => {
  return [
    {
      id: 'common',
      title: 'Common Features',
      inline: true,
      children: [
        {
          value: userToggle.reminder.all,
          path: 'toggle.reminder.all',
          label: 'Commands Reminder',
        },
        {
          value: userToggle.reminder.pet,
          path: 'toggle.reminder.pet',
          label: 'Pets Reminder',
        },
        {
          value: userToggle.dm.all,
          path: 'toggle.dm.all',
          label: 'Send all reminder in DMs',
        },
        {
          value: userToggle.training.all,
          path: 'toggle.training.all',
          label: 'Give answer on training',
        },
        {
          value: userToggle.petCatch,
          path: 'toggle.petCatch',
          label: 'Give actions to catch pet',
        },
        {
          value: userToggle.emoji,
          path: 'toggle.emoji',
          label: 'Reminder Emoji',
        },
        {
          value: userToggle.mentions.all,
          path: 'toggle.mentions.all',
          label: 'Message with mentions',
        },
        {
          value: userToggle.quest.all,
          path: 'toggle.quest.all',
          label: 'Show arena/miniboss cooldown on quest',
        },
        {
          value: userToggle.heal,
          path: 'toggle.heal',
          label: 'Heal reminder',
        },
        {
          value: userToggle.slash,
          path: 'toggle.slash',
          label: 'Reminder with slash commands',
        },
        {
          value: userToggle.countdown.all,
          path: 'toggle.countdown.all',
          label: 'Show countdown to upcoming reminder',
        },
      ],
    },
  ];
};

const guild = (guildToggle: IGuild['toggle']): IToggleEmbedsInfo[] => {
  return [
    {
      id: 'common',
      title: 'COMMON',
      inline: false,
      children: [
        {
          label: 'Enable / Disable Guild',
          value: guildToggle.onOff,
          path: 'toggle.onOff',
        },
      ],
    },
    {
      id: 'upgraid',
      title: 'UPGRADE/RAID REMINDER',
      inline: false,
      children: [
        {
          label: 'Enable / Disable',
          value: guildToggle.upgraid.reminder,
          path: 'toggle.upgraid.reminder',
        },
        {
          label: 'Send weekly count after upgrade / raid',
          value: guildToggle.upgraid.sendUpgraidList,
          path: 'toggle.upgraid.sendUpgraidList',
        },
        {
          label: 'Allow reserved',
          value: guildToggle.upgraid.allowReserved,
          path: 'toggle.upgraid.allowReserved',
        },
      ],
    },
    {
      id: 'duel',
      title: 'DUEL LOGGER',
      inline: false,
      children: [
        {
          label: 'Log the following commands',
          value: guildToggle.duel.log.all,
          path: 'toggle.duel.log.all',
          children: [
            {
              label: '`duel add`',
              value: guildToggle.duel.log.duelAdd,
              path: 'toggle.duel.log.add',
            },
            {
              label: '`duel undo`',
              value: guildToggle.duel.log.duelUndo,
              path: 'toggle.duel.log.undo',
            },
            {
              label: '`duel reset`',
              value: guildToggle.duel.log.duelReset,
              path: 'toggle.duel.log.reset',
            },
            {
              label: '`duel modify`',
              value: guildToggle.duel.log.duelModify,
              path: 'toggle.duel.log.modify',
            },
          ],
        },
        {
          label: 'Duel result message link is required',
          value: guildToggle.duel.refRequired,
          path: 'toggle.duel.refRequired',
        },
      ],
    },
  ];
};

const server = (serverToggle: IServerToggle): IToggleEmbedsInfo[] => {
  return [
    {
      id: 'general',
      title: 'General',
      inline: true,
      children: [
        {
          label: 'Enchant Mute',
          value: serverToggle.enchantMute,
          path: 'toggle.enchantMute',
        },
        {
          label: 'Random event ping',
          value: serverToggle.randomEvent,
          path: 'toggle.randomEvent',
        },
        {
          label: 'TT Verification',
          value: serverToggle.ttVerification,
          path: 'toggle.ttVerification',
        },
      ],
    },
  ];
};

export const toggleDisplayList = {
  donor,
  nonDonor,
  guild,
  server,
};
