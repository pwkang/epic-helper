import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {rpgXmasChimney} from '../../../../../lib/epic-rpg/commands/event/xmas/chimney';

export default <PrefixCommand>{
  name: 'xmasChimney',
  type: PREFIX_COMMAND_TYPE.rpg,
  commands: ['xmas chimney'],
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
  },
  execute: async (client, message) => {
    rpgXmasChimney({
      author: message.author,
      isSlashCommand: false,
      client,
      message,
    });
  },
};
