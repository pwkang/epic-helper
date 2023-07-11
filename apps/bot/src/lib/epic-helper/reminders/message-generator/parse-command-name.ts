import {
  RPG_COMMAND_TYPE,
  RPG_EPIC_ITEM_TYPES,
  RPG_FARM_SEED,
  RPG_LOOTBOX_TYPE,
  RPG_WORKING_TYPE,
} from '@epic-helper/constants';
import {IUser, IUserReminder, IUserReminderPropsCondition} from '@epic-helper/models';

interface IGetDailyCommandStr {}

const getDailyCommandStr = ({}: IGetDailyCommandStr) => {
  return `RPG DAILY`;
};

interface IGetWeeklyCommandStr {}

const getWeeklyCommandStr = ({}: IGetWeeklyCommandStr) => {
  return `RPG WEEKLY`;
};

interface IGetHuntCommandStr {
  hardMode?: boolean;
  together?: boolean;
  userAccount: IUser;
}

const getHuntCommandStr = ({hardMode, together, userAccount}: IGetHuntCommandStr) => {
  const huntSwitch = userAccount.toggle.huntSwitch;

  return `RPG HUNT${hardMode ? ' HARDMODE' : ''}${together && !huntSwitch ? ' TOGETHER' : ''}`;
};

interface IGetAdventureCommandStr {
  hardMode?: boolean;
}

const getAdventureCommandStr = ({hardMode}: IGetAdventureCommandStr) => {
  return `RPG ADVENTURE${hardMode ? ' HARDMODE' : ''}`;
};

interface IGetTrainingCommandStr {
  ultraining?: boolean;
}

const getTrainingCommandStr = ({ultraining}: IGetTrainingCommandStr) => {
  return ultraining ? `RPG ULTRAINING` : `RPG TRAINING`;
};

interface IGetDuelCommandStr {}

const getDuelCommandStr = ({}: IGetDuelCommandStr) => {
  return `RPG DUEL`;
};

interface IGetQuestCommandStr {
  epicQuest?: boolean;
}

const getQuestCommandStr = ({epicQuest}: IGetQuestCommandStr) => {
  return epicQuest ? `RPG EPIC QUEST` : `RPG QUEST`;
};

interface IGetWorkCommandStr {
  workingType?: ValuesOf<typeof RPG_WORKING_TYPE>;
}

const getWorkCommandStr = ({workingType}: IGetWorkCommandStr) => {
  return workingType ? `RPG ${workingType.toUpperCase()}` : 'RPG WORKING';
};

interface IGetFarmCommandStr {
  seedType?: ValuesOf<typeof RPG_FARM_SEED>;
}

const getFarmCommandStr = ({seedType}: IGetFarmCommandStr) => {
  return seedType ? `RPG FARM ${seedType.toUpperCase()}` : 'RPG FARM';
};

interface IGetHorseCommandStr {}

const getHorseCommandStr = ({}: IGetHorseCommandStr) => {
  return `RPG HORSE RACE/BREEDING`;
};

interface IGetArenaCommandStr {}

const GetArenaCommandStr = ({}: IGetArenaCommandStr) => {
  return `RPG ARENA`;
};

interface IGetDungeonCommandStr {}

const GetDungeonCommandStr = ({}: IGetDungeonCommandStr) => {
  return `RPG DUNGEON`;
};

interface IGetLootboxCommandStr {
  lootboxType?: ValuesOf<typeof RPG_LOOTBOX_TYPE>;
}

const GetLootboxCommandStr = ({lootboxType}: IGetLootboxCommandStr) => {
  return `RPG BUY ${lootboxType?.toUpperCase() || ''} LOOTBOX`;
};

interface IGetVoteCommandStr {}

const GetVoteCommandStr = ({}: IGetVoteCommandStr) => {
  return `RPG VOTE`;
};

interface IGetEpicItemCommandStr {
  epicItemType?: ValuesOf<typeof RPG_EPIC_ITEM_TYPES>;
}

const getEpicItemCommandStr = ({epicItemType}: IGetEpicItemCommandStr) => {
  return `RPG USE ${epicItemType ? epicItemType.toUpperCase() : 'EPIC ITEM'}`;
};

interface IGetPetCommandStr {}

const getPetCommandStr = ({}: IGetPetCommandStr) => {
  return `RPG PET CLAIM`;
};

type IGetPetTrainCommandStr = IUserReminder & {
  userAccount: IUser;
};

export const _parseCommandString = ({userAccount, props, type}: IGetPetTrainCommandStr) => {
  switch (type) {
    case RPG_COMMAND_TYPE.daily:
      return getDailyCommandStr({});
    case RPG_COMMAND_TYPE.weekly:
      return getWeeklyCommandStr({});
    case RPG_COMMAND_TYPE.lootbox:
      return GetLootboxCommandStr({
        lootboxType: props?.lootboxType,
      });
    case RPG_COMMAND_TYPE.vote:
      return GetVoteCommandStr({});
    case RPG_COMMAND_TYPE.hunt:
      return getHuntCommandStr({
        hardMode: props?.hardMode,
        together: props?.together,
        userAccount,
      });
    case RPG_COMMAND_TYPE.adventure:
      return getAdventureCommandStr({
        hardMode: props?.hardMode,
      });
    case RPG_COMMAND_TYPE.training:
      return getTrainingCommandStr({
        ultraining: props?.ultraining,
      });
    case RPG_COMMAND_TYPE.duel:
      return getDuelCommandStr({});
    case RPG_COMMAND_TYPE.quest:
      return getQuestCommandStr({
        epicQuest: props?.epicQuest,
      });
    case RPG_COMMAND_TYPE.working:
      return getWorkCommandStr({
        workingType: props?.workingType,
      });
    case RPG_COMMAND_TYPE.farm:
      return getFarmCommandStr({
        seedType: props?.seedType,
      });
    case RPG_COMMAND_TYPE.horse:
      return getHorseCommandStr({});
    case RPG_COMMAND_TYPE.arena:
      return GetArenaCommandStr({});
    case RPG_COMMAND_TYPE.dungeon:
      return GetDungeonCommandStr({});
    case RPG_COMMAND_TYPE.epicItem:
      return getEpicItemCommandStr({
        epicItemType: props?.epicItemType,
      });
    case RPG_COMMAND_TYPE.pet:
      return getPetCommandStr({});
    default:
      return '';
  }
};
