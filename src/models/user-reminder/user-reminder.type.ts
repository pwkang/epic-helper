import {RPG_FARM_SEED, RPG_WORKING_TYPE} from '../../constants/rpg';
import {LOOTBOX_TYPE} from '../../constants/lootbox';

type BaseUserReminder = {
  userId: string;
  readyAt: Date;
};

type Conditional =
  | {
      type: 'hunt';
      props: {
        together: boolean;
        hardMode: boolean;
      };
    }
  | {
      type: 'adventure';
      props: {
        hardMode: boolean;
      };
    }
  | {
      type: 'training';
      props: {
        ultraining: boolean;
      };
    }
  | {
      type: 'quest';
      props: {
        epicQuest: boolean;
      };
    }
  | {
      type: 'working';
      props: {
        workingType: ValuesOf<typeof RPG_WORKING_TYPE>;
      };
    }
  | {
      type: 'farm';
      props: {
        seedType: ValuesOf<typeof RPG_FARM_SEED>;
      };
    }
  | {
      type: 'pet';
      props: {
        petId: number;
      };
    }
  | {
      type: 'lootbox';
      props: {
        RPG_LOOTBOX_TYPE: any;
        lootboxType: ValuesOf<typeof LOOTBOX_TYPE>;
      };
    }
  | {
      type: 'daily' | 'weekly' | 'vote' | 'duel' | 'horse' | 'arena' | 'dungeon';
      props?: never;
    };

export type IUserReminder = BaseUserReminder & Conditional;
