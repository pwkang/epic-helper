import {
  rpgPetAdventure,
  rpgPetAdventureChecker,
} from '../../lib/epic-rpg/commands/pets/pet-adventure';
import {djsMessageHelper} from '../../lib/discordjs/message';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'test',
  commands: ['test'],
  type: PREFIX_COMMAND_TYPE.dev,
  execute: async (client, message) => {
    djsMessageHelper.reply({
      message,
      options: {
        content: `
    daily: '<a:daily:1121345868692463676>',
    weekly: '<a:weekly:1121479834686722088>',
    lootboxes: '<a:lootboxes:1121345889357811792>',
    vote: '<a:vote:1108797552289140861>',
    hunt: '<a:hunt:1108797566033862737>',
    adventure: '<a:adventure:1121345862510051358>',
    training: '<a:training:1121345896236453909>',
    quest: '<a:quest:1108797545787969546>',
    duel: '<a:duel:1121345871947243651>',
    working: '<a:working:1121345902188179516>',
    farm: '<a:farm:1108797664889413652>',
    arena: '<a:arena:1121345865240555611>',
    horse: '<a:horse:1108797695545589822>',
    dungeon: '<a:dungeon:1108797699228192859>',
    epicitems: '<a:epicitems:1108797549118247012>',`,
      },
      client,
    });
  },
};
