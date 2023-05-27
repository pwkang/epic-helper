import {OTHER_BOT_TYPE} from '../../../constants/bot';
import {rpgUltraining} from '../../../lib/epic_rpg/commands/progress/ultraining';
import {RPG_WORKING_TYPE} from '../../../constants/rpg';
import {rpgWorking} from '../../../lib/epic_rpg/commands/progress/working';

export default <SlashCommandOtherBot>{
  name: 'rpgWorking',
  bot: OTHER_BOT_TYPE.rpg,
  commandName: Object.values(RPG_WORKING_TYPE),
  execute: async (client, message, author) => {
    rpgWorking({
      author,
      message,
      client,
      isSlashCommand: true,
    });
  },
};
