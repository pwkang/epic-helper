import {
  RPG_CLICKABLE_SLASH_COMMANDS,
  RPG_COMMAND_TYPE,
  RPG_FARM_SEED,
  RPG_LOOTBOX_TYPE,
  RPG_WORKING_TYPE,
} from '@epic-helper/constants';
import {IUserReminder} from '@epic-helper/models';

interface IGetDailyCommandStr {
  slash?: boolean;
}

const getDailyCommandStr = ({slash}: IGetDailyCommandStr) => {
  return slash ? RPG_CLICKABLE_SLASH_COMMANDS.daily : `RPG DAILY`;
};

interface IGetWeeklyCommandStr {
  slash?: boolean;
}

const getWeeklyCommandStr = ({slash}: IGetWeeklyCommandStr) => {
  return slash ? RPG_CLICKABLE_SLASH_COMMANDS.weekly : `RPG WEEKLY`;
};

interface IGetHuntCommandStr {
  hardMode?: boolean;
  together?: boolean;
  slash?: boolean;
}

const getHuntCommandStr = ({hardMode, together, slash}: IGetHuntCommandStr) => {
  return slash
    ? RPG_CLICKABLE_SLASH_COMMANDS.hunt
    : `RPG HUNT${hardMode ? ' HARDMODE' : ''}${together ? ' TOGETHER' : ''}`;
};

interface IGetAdventureCommandStr {
  hardMode?: boolean;
  slash?: boolean;
}

const getAdventureCommandStr = ({hardMode, slash}: IGetAdventureCommandStr) => {
  return slash
    ? RPG_CLICKABLE_SLASH_COMMANDS.adventure
    : `RPG ADVENTURE${hardMode ? ' HARDMODE' : ''}`;
};

interface IGetTrainingCommandStr {
  ultraining?: boolean;
  slash?: boolean;
}

const getTrainingCommandStr = ({ultraining, slash}: IGetTrainingCommandStr) => {
  return slash
    ? ultraining
      ? RPG_CLICKABLE_SLASH_COMMANDS.ultraining
      : RPG_CLICKABLE_SLASH_COMMANDS.training
    : ultraining
    ? `RPG ULTRAINING`
    : `RPG TRAINING`;
};

interface IGetDuelCommandStr {
  slash?: boolean;
}

const getDuelCommandStr = ({slash}: IGetDuelCommandStr) => {
  return slash ? RPG_CLICKABLE_SLASH_COMMANDS.duel : `RPG DUEL`;
};

interface IGetQuestCommandStr {
  epicQuest?: boolean;
  slash?: boolean;
}

const getQuestCommandStr = ({epicQuest, slash}: IGetQuestCommandStr) => {
  return slash
    ? epicQuest
      ? RPG_CLICKABLE_SLASH_COMMANDS.epicQuest
      : RPG_CLICKABLE_SLASH_COMMANDS.quest
    : epicQuest
    ? `RPG EPIC QUEST`
    : `RPG QUEST`;
};

interface IGetWorkCommandStr {
  workingType?: ValuesOf<typeof RPG_WORKING_TYPE>;
  slash?: boolean;
}

const getWorkCommandStr = ({workingType, slash}: IGetWorkCommandStr) => {
  return workingType
    ? slash
      ? RPG_CLICKABLE_SLASH_COMMANDS[workingType]
      : `RPG ${workingType.toUpperCase()}`
    : 'RPG WORKING';
};

interface IGetFarmCommandStr {
  seedType?: ValuesOf<typeof RPG_FARM_SEED>;
  slash?: boolean;
}

const getFarmCommandStr = ({seedType, slash}: IGetFarmCommandStr) => {
  return seedType
    ? slash
      ? RPG_CLICKABLE_SLASH_COMMANDS.farm
      : `RPG FARM ${seedType.toUpperCase()}`
    : 'RPG FARM';
};

interface IGetHorseCommandStr {
  slash?: boolean;
}

const getHorseCommandStr = ({slash}: IGetHorseCommandStr) => {
  return slash
    ? `${RPG_CLICKABLE_SLASH_COMMANDS.horseRace} ${RPG_CLICKABLE_SLASH_COMMANDS.horseBreeding}`
    : `RPG HORSE RACE/BREEDING`;
};

interface IGetArenaCommandStr {
  slash?: boolean;
}

const GetArenaCommandStr = ({slash}: IGetArenaCommandStr) => {
  return slash ? RPG_CLICKABLE_SLASH_COMMANDS.arena : `RPG ARENA`;
};

interface IGetDungeonCommandStr {
  slash?: boolean;
}

const GetDungeonCommandStr = ({slash}: IGetDungeonCommandStr) => {
  return slash ? RPG_CLICKABLE_SLASH_COMMANDS.dungeon : `RPG DUNGEON`;
};

interface IGetLootboxCommandStr {
  slash?: boolean;
  lootboxType?: ValuesOf<typeof RPG_LOOTBOX_TYPE>;
}

const GetLootboxCommandStr = ({slash, lootboxType}: IGetLootboxCommandStr) => {
  return slash
    ? RPG_CLICKABLE_SLASH_COMMANDS.lootbox
    : `RPG BUY ${lootboxType?.toUpperCase() || ''} LOOTBOX`;
};

interface IGetVoteCommandStr {
  slash?: boolean;
}

const GetVoteCommandStr = ({slash}: IGetVoteCommandStr) => {
  return slash ? RPG_CLICKABLE_SLASH_COMMANDS.vote : `RPG VOTE`;
};

interface IGetCommandStr {
  type: ValuesOf<typeof RPG_COMMAND_TYPE>;
  props?: IUserReminder['props'];
  slash?: boolean;
}

export const getCommandStr = ({slash, type, props}: IGetCommandStr) => {
  switch (type) {
    case RPG_COMMAND_TYPE.daily:
      return getDailyCommandStr({...props, slash});
    case RPG_COMMAND_TYPE.weekly:
      return getWeeklyCommandStr({...props, slash});
    case RPG_COMMAND_TYPE.lootbox:
      return GetLootboxCommandStr({...props, slash});
    case RPG_COMMAND_TYPE.vote:
      return GetVoteCommandStr({...props, slash});
    case RPG_COMMAND_TYPE.hunt:
      return getHuntCommandStr({...props, slash});
    case RPG_COMMAND_TYPE.adventure:
      return getAdventureCommandStr({...props, slash});
    case RPG_COMMAND_TYPE.training:
      return getTrainingCommandStr({...props, slash});
    case RPG_COMMAND_TYPE.duel:
      return getDuelCommandStr({slash});
    case RPG_COMMAND_TYPE.quest:
      return getQuestCommandStr({...props, slash});
    case RPG_COMMAND_TYPE.working:
      return getWorkCommandStr({...props, slash});
    case RPG_COMMAND_TYPE.farm:
      return getFarmCommandStr({...props, slash});
    case RPG_COMMAND_TYPE.horse:
      return getHorseCommandStr({slash});
    case RPG_COMMAND_TYPE.arena:
      return GetArenaCommandStr({slash});
    case RPG_COMMAND_TYPE.dungeon:
      return GetDungeonCommandStr({slash});
    default:
      return '';
  }
};
