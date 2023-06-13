import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgUltraining} from '../../../../lib/epic-rpg/commands/progress/ultraining';

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