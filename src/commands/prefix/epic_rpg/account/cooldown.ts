import {COMMAND_TYPE} from '../../../../constants/bot';
import {createRpgCommandListener} from '../../../../lib/epic_rpg/createRpgCommandListener';
import rpgCooldownSuccess, {
  isRpgCooldownResponse,
  rpgCooldown,
} from '../../../../lib/epic_rpg/commands/account/cooldown';

export default <PrefixCommand>{
  name: 'rpgCooldown',
  commands: ['cooldowns', 'cooldown', 'cd'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgCooldown({
      author: message.author,
      message,
      isSlashCommand: false,
      client,
    });
  },
};
