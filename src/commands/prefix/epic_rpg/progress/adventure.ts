import {COMMAND_TYPE} from '../../../../constants/bot';
import {rpgAdventure} from '../../../../lib/epic_rpg/commands/progress/adventure';

export default <PrefixCommand>{
  name: 'rpgAdventure',
  commands: ['adventure', 'adv'],
  type: COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgAdventure({
      author: message.author,
      message,
      client,
      isSlashCommand: false,
    });
  },
};
