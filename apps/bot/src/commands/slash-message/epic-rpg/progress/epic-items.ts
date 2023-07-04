import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';
import {rpgUseEpicItem} from '../../../../lib/epic-rpg/commands/progress/epic-items';

export default <SlashMessage>{
  name: 'rpgUse',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['use'],
  execute: async (client, message, author) => {
    rpgUseEpicItem({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
