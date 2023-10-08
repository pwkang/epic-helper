import {
  USER_ACC_OFF_ACTIONS,
  USER_NOT_REGISTERED_ACTIONS
} from '@epic-helper/constants';
import {SLASH_COMMAND} from './constant';

export default <SlashCommand>{
  name: SLASH_COMMAND.help.name,
  description: SLASH_COMMAND.help.description,
  preCheck: {
    userAccOff: USER_ACC_OFF_ACTIONS.skip,
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.skip
  },
  type: 'command',
  execute: async () => {}
};
