import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';
import {rpgUseSleepyPotion} from '../../../../lib/epic-rpg/commands/event/sleepy-potion';

export default <PrefixCommand>{
  name: 'sleepy-potion',
  commands: ['xmas'].map((v) => `${v} use sleepy potion`),
  type: PREFIX_COMMAND_TYPE.rpg,
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  execute: async (client, message) => {
    await rpgUseSleepyPotion({
      client,
      author: message.author,
      message,
      isSlashCommand: false,
    });
  },
};
