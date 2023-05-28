import {COMMAND_TYPE} from '../../../../constants/bot';
import {rpgOpenLootbox} from '../../../../lib/epic_rpg/commands/other/open';

export default <PrefixCommand>{
  name: 'rpgOpen',
  commands: ['open'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgOpenLootbox({
      author: message.author,
      client,
      message,
      isSlashCommand: false,
    });
  },
};
