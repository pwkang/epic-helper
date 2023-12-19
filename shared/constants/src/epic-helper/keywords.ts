import type {RPG_COMMAND_TYPE} from '../epic-rpg/rpg';
import {RPG_WORKING_TYPE} from '../epic-rpg/rpg';

type IKeyword = Record<keyof typeof RPG_COMMAND_TYPE, string[]>;

export const RPG_COMMANDS_KEYWORDS: IKeyword = {
  adventure: ['adventure', 'adv'],
  hunt: ['hunt'],
  arena: ['arena'],
  daily: ['daily'],
  duel: ['duel'],
  dungeon: ['dungeon', 'miniboss'],
  farm: ['farm'],
  horse: ['horse', 'horse breed', 'horse race'],
  lootbox: ['lootbox', 'buy'],
  pet: ['pet', 'pets'],
  petSummary: ['pet summary', 'pets summary'],
  quest: ['quest', 'epic quest'],
  epicItem: ['use', 'epic items', 'epic item', 'epicItems', 'epicItem'],
  training: ['training', 'tr'],
  vote: ['vote'],
  weekly: ['weekly'],
  working: ['working', ...Object.keys(RPG_WORKING_TYPE)],
  xmasChimney: ['xmasChimney', 'xmas chimney', 'chimney'],
};
