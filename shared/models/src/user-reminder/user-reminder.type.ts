import {ValuesOf} from '@epic-helper/ts-utils';
import {RPG_FARM_SEED, RPG_LOOTBOX_TYPE, RPG_WORKING_TYPE} from '@epic-helper/constants';

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

type BaseUserReminder = {
  userId: string;
  readyAt: Date;
};

type Conditional =
  | {
      type: 'hunt';
      props: IHuntReminderProps;
    }
  | {
      type: 'adventure';
      props: IAdventureReminderProps;
    }
  | {
      type: 'training';
      props: ITrainingReminderProps;
    }
  | {
      type: 'quest';
      props: IQuestReminderProps;
    }
  | {
      type: 'working';
      props: IWorkingReminderProps;
    }
  | {
      type: 'farm';
      props: IFarmReminderProps;
    }
  | {
      type: 'lootbox';
      props: ILootboxReminderProps;
    }
  | {
      type: 'daily' | 'weekly' | 'vote' | 'duel' | 'horse' | 'arena' | 'dungeon' | 'pet';
      props?: never;
    };

export type IUserReminder = BaseUserReminder & Conditional;
