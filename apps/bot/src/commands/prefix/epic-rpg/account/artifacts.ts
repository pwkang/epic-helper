import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {rpgArtifacts} from '../../../../lib/epic-rpg/commands/account/artifacts';

export default <PrefixCommand>{
  name: 'rpgArtifacts',
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
  },
  commands: ['artifacts'],
  execute: async (client, message) => {
    rpgArtifacts({
      client,
      author: message.author,
      message,
      isSlashCommand: false,
    });
  },
};
