import {
  RPG_EPIC_ITEM_TYPES,
  RPG_FARM_SEED,
  RPG_LOOTBOX_TYPE,
  RPG_WORKING_TYPE,
  RPG_COMMAND_TYPE,
} from '@epic-helper/constants';
import {ValuesOf} from '../type';

export interface IHuntReminderProps {
  together: boolean;
  hardMode: boolean;
}

export interface IAdventureReminderProps {
  hardMode: boolean;
}

export interface ITrainingReminderProps {
  ultraining: boolean;
}

export interface IQuestReminderProps {
  epicQuest: boolean;
}

export interface IWorkingReminderProps {
  workingType: ValuesOf<typeof RPG_WORKING_TYPE>;
}

export interface IFarmReminderProps {
  seedType: ValuesOf<typeof RPG_FARM_SEED>;
}

export interface IPetReminderProps {
  petId: number;
}

export interface ILootboxReminderProps {
  lootboxType: ValuesOf<typeof RPG_LOOTBOX_TYPE>;
}

export interface IEpicItemReminderProps {
  epicItemType: ValuesOf<typeof RPG_EPIC_ITEM_TYPES>;
}

type BaseUserReminder = {
  userId: string;
  readyAt?: Date;
};

export type IUserReminderPropsCondition =
  | {
      type: typeof RPG_COMMAND_TYPE.hunt;
      props: IHuntReminderProps;
    }
  | {
      type: typeof RPG_COMMAND_TYPE.adventure;
      props: IAdventureReminderProps;
    }
  | {
      type: typeof RPG_COMMAND_TYPE.training;
      props: ITrainingReminderProps;
    }
  | {
      type: typeof RPG_COMMAND_TYPE.quest;
      props: IQuestReminderProps;
    }
  | {
      type: typeof RPG_COMMAND_TYPE.working;
      props: IWorkingReminderProps;
    }
  | {
      type: typeof RPG_COMMAND_TYPE.farm;
      props: IFarmReminderProps;
    }
  | {
      type: typeof RPG_COMMAND_TYPE.lootbox;
      props: ILootboxReminderProps;
    }
  | {
      type: typeof RPG_COMMAND_TYPE.epicItem;
      props: IEpicItemReminderProps;
    }
  | {
      type:
        | typeof RPG_COMMAND_TYPE.daily
        | typeof RPG_COMMAND_TYPE.weekly
        | typeof RPG_COMMAND_TYPE.vote
        | typeof RPG_COMMAND_TYPE.duel
        | typeof RPG_COMMAND_TYPE.horse
        | typeof RPG_COMMAND_TYPE.arena
        | typeof RPG_COMMAND_TYPE.dungeon
        | typeof RPG_COMMAND_TYPE.pet;

      props?: never;
    };

export type IUserReminder = BaseUserReminder & IUserReminderPropsCondition;
