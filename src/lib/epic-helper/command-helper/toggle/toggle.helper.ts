import {IUser, IUserToggle} from '../../../../models/user/user.type';
import {IToggleEmbedsInfo, renderEmbed} from './toggle.embed';
import {UpdateQuery} from 'mongoose';

const userToggleType = {
  common: 'common',
  reminder: 'reminder',
  mentions: 'mentions',
  dm: 'dm',
} as const;

const getDonorToggle = (userToggle: IUserToggle): IToggleEmbedsInfo[] => {
  return [
    {
      id: 'common',
      title: 'Common Features',
      children: [
        {
          value: userToggle.reminder.pet,
          path: 'toggle.reminder.pet',
          label: 'Pets Reminder',
        },
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
        // {
        //   value: userToggle.event.loveShareAdv,
        //   label: 'Adventure -10% cooldown',
        // },
        // {
        //     value: "toggle.world.all",
        //     label: "World boost reminder",
        //     children: [
        //         {
        //             value: "toggle.world.monster",
        //             label: "Monster drop"
        //         },
        //         {
        //             value: "toggle.world.lootbox",
        //             label: "Lootbox drop"
        //         }
        //     ]
        // },
      ],
    },
    {
      id: 'reminder',
      title: 'Custom Reminder',
      value: userToggle.reminder.all,
      path: 'toggle.reminder.all',
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
          value: userToggle.reminder.use,
          path: 'toggle.reminder.use',
          label: 'Epic Items',
        },
      ],
    },
    {
      id: 'dm',
      title: 'Custom DMs',
      value: userToggle.dm.all,
      path: 'toggle.dm.all',
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
          value: userToggle.dm.use,
          path: 'toggle.dm.use',
          label: 'Epic Items',
        },
        {
          value: userToggle.dm.pet,
          path: 'toggle.dm.pet',
          label: 'Pets',
        },
        // {
        //     value: "toggle.dm.world",
        //     label: "World boost"
        // }
      ],
    },
    {
      id: 'mentions',
      title: 'Custom Mentions',
      value: userToggle.mentions.all,
      path: 'toggle.mentions.all',
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
          value: userToggle.mentions.use,
          path: 'toggle.mentions.use',
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

const getNonDonorToggle = (userToggle: IUserToggle): IToggleEmbedsInfo[] => {
  return [
    {
      id: 'common',
      title: 'Common Features',
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

interface IGetUpdateQuery {
  toggleInfo: IToggleEmbedsInfo[];
  on?: string;
  off?: string;
}

const regex1 = /^([a-z])([0-9]+)$/;
const regex2 = /^([a-z])([0-9]+)([a-z])$/;

const getUpdateQuery = ({toggleInfo, on, off}: IGetUpdateQuery): UpdateQuery<IUser> => {
  const itemOn =
    on
      ?.toLowerCase()
      .split(' ')
      .filter((item) => regex1.test(item) || regex2.test(item))
      .map((item) => findPath(item, toggleInfo)) ?? [];
  const itemOff =
    off
      ?.toLowerCase()
      .split(' ')
      .filter((item) => regex1.test(item) || regex2.test(item))
      .map((item) => findPath(item, toggleInfo)) ?? [];

  const query: UpdateQuery<IUser> = {
    $set: {},
  };

  for (const item of itemOn) {
    if (!item) continue;
    query.$set![item] = true;
  }

  for (const item of itemOff) {
    if (!item) continue;
    query.$set![item] = false;
  }
  return query;
};

const findPath = (key: string, toggleInfo: IToggleEmbedsInfo[]): string | null => {
  const _key = regex1.test(key) ? key.match(regex1) : regex2.test(key) ? key.match(regex2) : null;
  if (!_key) return null;

  // convert a -> 0, b -> 1, c -> 2
  const index1 = _key[1].charCodeAt(0) - 97;
  const index2 = parseInt(_key[2]) - 1;
  const index3 = _key[3] ? _key[3].charCodeAt(0) - 97 : null;

  const path = toggleInfo[index1]?.children[index2] ?? null;

  if (!path) return null;

  if (index3 !== null && path.children) {
    return path.children[index3].path;
  } else {
    return path.path;
  }
};

const _toggleHelper = {
  getDonorToggle,
  getNonDonorToggle,
  renderEmbed,
  getUpdateQuery,
  userToggleType,
};

export default _toggleHelper;
