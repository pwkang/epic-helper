import {SLASH_MESSAGE_BOT_TYPE} from '../../../../constants/bot';
import {RPG_WORKING_TYPE} from '../../../../constants/epic-rpg/rpg';
import {rpgWorking} from '../../../../lib/epic-rpg/commands/progress/working';

export default <SlashMessage>{
  name: 'rpgWorking',
  bot: SLASH_MESSAGE_BOT_TYPE.rpg,
  commandName: Object.values(RPG_WORKING_TYPE),
  execute: async (client, message, author) => {
    const workingType = Object.values(RPG_WORKING_TYPE).find(
      (type) => message.interaction?.commandName === type
    );
    if (!workingType) return;
    rpgWorking({
      author,
      message,
      client,
      isSlashCommand: true,
      workingType,
    });
  },
};