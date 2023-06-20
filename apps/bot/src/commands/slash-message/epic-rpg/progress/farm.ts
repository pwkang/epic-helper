import {rpgFarm} from '../../../../lib/epic-rpg/commands/progress/farm';
import {SLASH_MESSAGE_BOT_TYPE} from '@epic-helper/constants';

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
