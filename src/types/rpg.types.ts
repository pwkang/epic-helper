import {RPG_AREA} from '../constants/epic_rpg/rpg';

export type RpgArea = ValuesOf<typeof RPG_AREA>;

//[keyof typeof statsToShow, string][]
export type Entries<T, K> = [keyof T, K][];
