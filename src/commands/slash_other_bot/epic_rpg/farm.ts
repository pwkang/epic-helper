import {OTHER_BOT_TYPE} from '../../../constants/bot';
import {rpgDaily} from '../../../lib/epic_rpg/commands/progress/daily';
import {rpgFarm} from '../../../lib/epic_rpg/commands/progress/farm';

export default <SlashCommandOtherBot>{
  name: 'rpgFarm',
  bot: OTHER_BOT_TYPE.rpg,
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