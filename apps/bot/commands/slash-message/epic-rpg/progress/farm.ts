import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {rpgFarm} from '../../../../lib/epic-rpg/commands/progress/farm';

export default <SlashMessage>{
  name: 'rpgFarm',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: ['farm'],
  execute: async (client, message, author) => {
    rpgFarm({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
