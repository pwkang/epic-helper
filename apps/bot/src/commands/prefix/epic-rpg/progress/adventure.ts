import {rpgAdventure} from '../../../../lib/epic-rpg/commands/progress/adventure';
import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';

export default <PrefixCommand>{
  name: 'rpgAdventure',
  commands: ['adventure', 'adv'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: async (client, message) => {
    rpgAdventure({
      author: message.author,
      message,
      client,
      isSlashCommand: false,
    });
  },
};
