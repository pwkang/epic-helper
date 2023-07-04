import {rpgAdventure} from '../../../../lib/epic-rpg/commands/progress/adventure';
import {
  PREFIX_COMMAND_TYPE,
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS,
} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgAdventure',
  commands: ['adventure', 'adv'],
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message) => {
    rpgAdventure({
      author: message.author,
      message,
      client,
      isSlashCommand: false,
    });
  },
};
