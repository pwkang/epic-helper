import {CLICKABLE_SLASH_RPG} from '../../../constants/clickable_slash';
import {RPG_COMMAND_TYPE, RPG_FARM_SEED, RPG_WORKING_TYPE} from '../../../constants/rpg';
import {IUserReminder} from '../../../models/user-reminder/user-reminder.type';
import {LOOTBOX_TYPE} from '../../../constants/lootbox';

interface IGetDailyCommandStr {
  slash?: boolean;
}

const getDailyCommandStr = ({slash}: IGetDailyCommandStr) => {
  return slash ? CLICKABLE_SLASH_RPG.daily : `RPG DAILY`;
};

interface IGetWeeklyCommandStr {
  slash?: boolean;
}

const getWeeklyCommandStr = ({slash}: IGetWeeklyCommandStr) => {
  return slash ? CLICKABLE_SLASH_RPG.weekly : `RPG WEEKLY`;
};

interface IGetHuntCommandStr {
  hardMode?: boolean;
  together?: boolean;
  slash?: boolean;
}

const getHuntCommandStr = ({hardMode, together, slash}: IGetHuntCommandStr) => {
  return slash
    ? CLICKABLE_SLASH_RPG.hunt
    : `RPG HUNT${hardMode ? ' HARDMODE' : ''}${together ? ' TOGETHER' : ''}`;
};

interface IGetAdventureCommandStr {
  hardMode?: boolean;
  slash?: boolean;
}

const getAdventureCommandStr = ({hardMode, slash}: IGetAdventureCommandStr) => {
  return slash ? CLICKABLE_SLASH_RPG.adventure : `RPG ADVENTURE${hardMode ? ' HARDMODE' : ''}`;
};

interface IGetTrainingCommandStr {
  ultraining?: boolean;
  slash?: boolean;
}

const getTrainingCommandStr = ({ultraining, slash}: IGetTrainingCommandStr) => {
  return slash
    ? ultraining
      ? CLICKABLE_SLASH_RPG.ultraining
      : CLICKABLE_SLASH_RPG.training
    : ultraining
    ? `RPG ULTRAINING`
    : `RPG TRAINING`;
};

interface IGetDuelCommandStr {
  slash?: boolean;
}

const getDuelCommandStr = ({slash}: IGetDuelCommandStr) => {
  return slash ? CLICKABLE_SLASH_RPG.duel : `RPG DUEL`;
};

interface IGetQuestCommandStr {
  epicQuest?: boolean;
  slash?: boolean;
}

const getQuestCommandStr = ({epicQuest, slash}: IGetQuestCommandStr) => {
  return slash
    ? epicQuest
      ? CLICKABLE_SLASH_RPG.epicQuest
      : CLICKABLE_SLASH_RPG.quest
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
      ? CLICKABLE_SLASH_RPG[workingType]
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
      ? CLICKABLE_SLASH_RPG.farm
      : `RPG FARM ${seedType.toUpperCase()}`
    : 'RPG FARM';
};

interface IGetHorseCommandStr {
  slash?: boolean;
}

const getHorseCommandStr = ({slash}: IGetHorseCommandStr) => {
  return slash
    ? `${CLICKABLE_SLASH_RPG.horseRace} ${CLICKABLE_SLASH_RPG.horseBreeding}`
    : `RPG HORSE RACE/BREEDING`;
};

interface IGetArenaCommandStr {
  slash?: boolean;
}

const GetArenaCommandStr = ({slash}: IGetArenaCommandStr) => {
  return slash ? CLICKABLE_SLASH_RPG.arena : `RPG ARENA`;
};

interface IGetDungeonCommandStr {
  slash?: boolean;
}

const GetDungeonCommandStr = ({slash}: IGetDungeonCommandStr) => {
  return slash ? CLICKABLE_SLASH_RPG.dungeon : `RPG DUNGEON`;
};

interface IGetLootboxCommandStr {
  slash?: boolean;
  lootboxType?: ValuesOf<typeof LOOTBOX_TYPE>;
}

const GetLootboxCommandStr = ({slash, lootboxType}: IGetLootboxCommandStr) => {
  return slash
    ? CLICKABLE_SLASH_RPG.lootbox
    : `RPG BUY ${lootboxType?.toUpperCase() || ''} LOOTBOX`;
};

interface IGetVoteCommandStr {
  slash?: boolean;
}

const GetVoteCommandStr = ({slash}: IGetVoteCommandStr) => {
  return slash ? CLICKABLE_SLASH_RPG.vote : `RPG VOTE`;
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
