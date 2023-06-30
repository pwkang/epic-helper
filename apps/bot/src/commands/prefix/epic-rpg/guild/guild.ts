import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {rpgGuild} from '../../../../lib/epic-rpg/commands/guild/guild';

export default <PrefixCommand>{
  name: 'guild',
  commands: ['guild'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: (client, message) => {
    rpgGuild({
      author: message.author,
      message,
      isSlashCommand: false,
      client,
    });
  },
};
