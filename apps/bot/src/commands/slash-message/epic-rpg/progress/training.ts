import {rpgTraining} from '../../../../lib/epic-rpg/commands/progress/training';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

export default <SlashMessage>{
  name: 'rpgTraining',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['training'],
  execute: async (client, message, author) => {
    rpgTraining({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
