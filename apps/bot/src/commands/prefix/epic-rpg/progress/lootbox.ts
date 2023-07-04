import {rpgBuyLootbox} from '../../../../lib/epic-rpg/commands/progress/lootbox';
import {
  PREFIX_COMMAND_TYPE,
  RPG_LOOTBOX_ABBREVIATION,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgBuyLootbox',
  type: PREFIX_COMMAND_TYPE.rpg,
  commands: Object.values(RPG_LOOTBOX_ABBREVIATION)
    .flat()
    .map((type) => ['lootbox', 'lb'].map((lb) => `buy ${type} ${lb}`))
    .flatMap((x) => x),
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message) => {
    rpgBuyLootbox({
      author: message.author,
      client,
      message,
      isSlashCommand: false,
    });
  },
};
