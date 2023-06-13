import {PREFIX_COMMAND_TYPE} from '../../../../constants/bot';
import {rpgOpenLootbox} from '../../../../lib/epic-rpg/commands/other/open';

export default <PrefixCommand>{
  name: 'rpgOpen',
  commands: ['open'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgOpenLootbox({
      author: message.author,
      client,
      message,
      isSlashCommand: false,
    });
  },
};
