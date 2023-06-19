import {rpgUltraining} from '../../../../lib/epic-rpg/commands/progress/ultraining';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgUltraining',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['ultraining start'],
  execute: async (client, message, author) => {
    rpgUltraining({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
