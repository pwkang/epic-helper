import {RPG_COMMAND_TYPE, RPG_FARM_SEED, RPG_WORKING_TYPE} from '../../types/rpg';

export type ReminderType = keyof typeof RPG_COMMAND_TYPE | 'pet';

type BaseUserReminder = {
  uId: string;
  type: ReminderType;
  readyAt: Date;
  props?: {
    together?: unknown;
    hardMode?: unknown;
    ultraining?: unknown;
    epicQuest?: unknown;
    workingType?: unknown;
    seedType?: unknown;
    petId?: unknown;
  };
};

type Conditional =
  | {
      type: 'hunt';
      props: {
        together: boolean;
        hardMode: boolean;
        ultraining?: never;
        epicQuest?: never;
        workingType?: never;
        seedType?: never;
        petId?: never;
      };
    }
  | {
      type: 'adventure';
      props: {
        hardMode: boolean;
        together?: never;
        ultraining?: never;
        epicQuest?: never;
        workingType?: never;
        seedType?: never;
        petId?: never;
      };
    }
  | {
      type: 'training';
      props: {
        ultraining: boolean;
        together?: never;
        hardMode?: never;
        epicQuest?: never;
        workingType?: never;
        seedType?: never;
        petId?: never;
      };
    }
  | {
      type: 'quest';
      props: {
        epicQuest: boolean;
        together?: never;
        hardMode?: never;
        ultraining?: never;
        workingType?: never;
        seedType?: never;
        petId?: never;
      };
    }
  | {
      type: 'working';
      props: {
        workingType: ValuesOf<typeof RPG_WORKING_TYPE>;
        together?: never;
        hardMode?: never;
        ultraining?: never;
        epicQuest?: never;
        seedType?: never;
        petId?: never;
      };
    }
  | {
      type: 'farm';
      props: {
        seedType: ValuesOf<typeof RPG_FARM_SEED>;
        together?: never;
        hardMode?: never;
        ultraining?: never;
        epicQuest?: never;
        workingType?: never;
        petId?: never;
      };
    }
  | {
      type: 'pet';
      props: {
        petId: number;
        together?: never;
        hardMode?: never;
        ultraining?: never;
        epicQuest?: never;
        workingType?: never;
        seedType?: never;
      };
    }
  | {
      type: 'daily' | 'weekly' | 'lootbox' | 'vote' | 'duel' | 'arena' | 'dungeon';
      props?: {
        together?: never;
        hardMode?: never;
        ultraining?: never;
        epicQuest?: never;
        workingType?: never;
        seedType?: never;
        petId?: never;
      };
    };

export type IUserReminder = BaseUserReminder & Conditional;
