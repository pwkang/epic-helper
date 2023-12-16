import type {
  RPG_COMMAND_TYPE,
  RPG_EPIC_ITEM_TYPES,
  RPG_FARM_SEED,
  RPG_LOOTBOX_TYPE,
  RPG_WORKING_TYPE,
} from '@epic-helper/constants';
import type {ValuesOf} from '@epic-helper/types';

export interface IHuntReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.hunt;
  props: {
    together?: boolean;
    hardMode?: boolean;
  };
}

export interface IAdventureReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.adventure;
  props: {
    hardMode?: boolean;
  };
}

export interface ITrainingReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.training;
  props: {
    ultraining?: boolean;
  };
}

export interface IQuestReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.quest;
  props: {
    epicQuest?: boolean;
  };
}

export interface IWorkingReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.working;
  props: {
    workingType?: ValuesOf<typeof RPG_WORKING_TYPE>;
  };
}

export interface IFarmReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.farm;
  props: {
    seedType?: ValuesOf<typeof RPG_FARM_SEED>;
  };
}

export interface ILootboxReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.lootbox;
  props: {
    lootboxType?: ValuesOf<typeof RPG_LOOTBOX_TYPE>;
  };
}

export interface IEpicItemReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.epicItem;
  props: {
    epicItemType?: ValuesOf<typeof RPG_EPIC_ITEM_TYPES>;
  }
}

export interface IDailyReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.daily;
  props?: never;
}

export interface IWeeklyReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.weekly;
  props?: never;
}

export interface IVoteReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.vote;
  props?: never;
}

export interface IDuelReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.duel;
  props?: never;
}

export interface IHorseReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.horse;
  props?: never;
}

export interface IArenaReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.arena;
  props?: never;
}

export interface IDungeonReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.dungeon;
  props?: never;
}

export interface IPetReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.pet;
  props?: never;
}

export interface IXmasChimneyReminder extends BaseUserReminder {
  type: typeof RPG_COMMAND_TYPE.xmasChimney;
  props?: never;
}

type BaseUserReminder = {
  userId: string;
  readyAt?: Date;
  updatedAt?: Date;
};

export type IUserReminder =
  | IHuntReminder
  | IAdventureReminder
  | ITrainingReminder
  | IQuestReminder
  | IWorkingReminder
  | IFarmReminder
  | ILootboxReminder
  | IEpicItemReminder
  | IDailyReminder
  | IWeeklyReminder
  | IVoteReminder
  | IDuelReminder
  | IHorseReminder
  | IArenaReminder
  | IDungeonReminder
  | IPetReminder
  | IXmasChimneyReminder;
