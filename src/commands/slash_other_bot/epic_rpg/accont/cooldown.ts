import {OTHER_BOT_TYPE} from '../../../../constants/bot';
import {rpgCooldown} from '../../../../lib/epic_rpg/commands/account/cooldown';

export default <SlashCommandOtherBot>{
  name: 'rpgCooldown',
  bot: OTHER_BOT_TYPE.rpg,
  commandName: ['cd'],
  execute: async (client, message, author) => {
    rpgCooldown({
      client,
      author,
      message,
      isSlashCommand: true,
    });
  },
};
