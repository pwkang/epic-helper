import {rpgCooldown} from '../../../../lib/epic-rpg/commands/account/cooldown';
import {updateReminderChannel} from '../../../../lib/epic-helper/reminders/reminder-channel';
import {PREFIX_COMMAND_TYPE, USER_ACC_OFF_ACTIONS, USER_NOT_REGISTERED_ACTIONS} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgCooldown',
  commands: ['cooldowns', 'cooldown', 'cd'],
  preCheck: {
    userNotRegistered: USER_NOT_REGISTERED_ACTIONS.abort,
    userAccOff: USER_ACC_OFF_ACTIONS.abort,
  },
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgCooldown({
      author: message.author,
      message,
      isSlashCommand: false,
      client,
    });
    await updateReminderChannel({
      userId: message.author.id,
      channelId: message.channelId,
    });
  },
};
