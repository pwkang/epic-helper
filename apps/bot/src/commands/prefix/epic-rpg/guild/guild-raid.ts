import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {rpgGuildRaid} from '../../../../lib/epic-rpg/commands/guild/guild-raid';

export default <PrefixCommand>{
  name: 'guildRaid',
  commands: ['guild raid'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: (client, message) => {
    rpgGuildRaid({
      author: message.author,
      message,
      isSlashCommand: false,
      client,
    });
  },
};
