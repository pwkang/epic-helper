import {PREFIX_COMMAND_TYPE} from '@epic-helper/constants';
import {rpgGuildUpgrade} from '../../../../lib/epic-rpg/commands/guild/guild-upgrade';

export default <PrefixCommand>{
  name: 'guildUpgrade',
  commands: ['guild upgrade'],
  type: PREFIX_COMMAND_TYPE.rpg,
  execute: (client, message) => {
    rpgGuildUpgrade({
      author: message.author,
      message,
      isSlashCommand: false,
      client,
    });
  },
};
